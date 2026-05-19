import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ETceProtocoloClient } from '../etce/etce-protocolo.client';
import { PrismaService } from 'prisma/prisma.service';
import { ProtocolarPdfDto } from './protocolar-pdf.dto';
import type { ArquivoProtocolo, GerarProtocoloRequest } from './gerar-protocolo.dto';
import { PdfService } from 'src/pdf/pdf-service';
import { CiMemoriaPdfBuilder } from './ci-memoria-pdf.builder';
import type {
  CiMemoriaEventoBloco,
  CiMemoriaParticipanteDetalhe,
  CiMemoriaPdfDados,
} from './ci-memoria-pdf.types';
import { moedaPorExtensoPtBr } from './moeda-extenso-pt';
import {
  enumerarDiasPeriodoPt,
  fmtBrl,
  formatarDiariasContadas,
  formatarPeriodoEventoPt,
  minMaxDatas,
  normalizarCpf,
} from './ci-memoria-helpers';


const MAX_PDF_BYTES = 10 * 1024 * 1024;

export interface ProtocoloResultado {
  codTce: string;
  jaProtocolada: boolean;
}

@Injectable()
export class ProtocolosService {
  private readonly logger = new Logger(ProtocolosService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly etceClient: ETceProtocoloClient,
    private readonly ciMemoriaPdfBuilder: CiMemoriaPdfBuilder,
    private readonly pdfService: PdfService,
  ) {}

  async protocolar( solicitacaoId: number, dto: ProtocolarPdfDto,): Promise<ProtocoloResultado> {
  this.logger.log(`🚀 Iniciando protocolar - solicitaçãoId: ${solicitacaoId}`);

  let dtoProtocolo: ProtocolarPdfDto | undefined;
  try {
    // 1. Verifica se a solicitação existe
    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id: solicitacaoId },
      select: { id: true, protocolo: true },
    });

    if (!solicitacao) {
      throw new NotFoundException(`Solicitação ${solicitacaoId} não encontrada.`);
    }

    // 2. Idempotência
    if (solicitacao.protocolo) {
      this.logger.log(
        `Solicitação ${solicitacaoId} já protocolada: ${solicitacao.protocolo}`,
      );
      return { codTce: solicitacao.protocolo, jaProtocolada: true };
    }

    // 3. PDF da solicitação gerado no servidor (contas bancárias via ContaDiaria + detalhesDaSolicitacao)
    const pdfBuffer = await this.pdfService.generateSolicitacaoPdf(
      solicitacaoId,
      false,
    );
    dtoProtocolo = {
      ...dto,
      pdfBase64: pdfBuffer.toString('base64'),
    };
    this.logger.log(
      `PDF solicitação gerado no servidor para protocolo ${solicitacaoId}: ` +
        `${this.tamanhoEmBytes(dtoProtocolo.pdfBase64!)} bytes`,
    );

    // 4. Validações locais
    this.validarTamanhoPdf(dtoProtocolo.pdfBase64!);
    this.validarCodUgEtce();

    const doisPdfsSoNoGerar = this.config.get<boolean>(
      'etce.protocoloGerarComDoisPdfsNumOficioNoCi',
    );

    let Cod_TCE: string;

    if (doisPdfsSoNoGerar) {
      this.logger.log(
        `Protocolando solicitação ${solicitacaoId} (2 PDFs no POST /gerar; C.I. com nº do ofício): cpf=${dto.interessado.cpf}`,
      );
      const dadosCi = await this.montarCiMemoriaDadosCompleto(
        solicitacaoId,
        dtoProtocolo,
      );
      const memorandoPdfBase64 = await this.ciMemoriaPdfBuilder.buildBase64(
        dadosCi,
      );
      this.validarTamanhoPdf(memorandoPdfBase64);

      const payloadCompleto = this.montarPayload(dtoProtocolo, memorandoPdfBase64);
      this.logger.log(
        `e-TCE /gerar com ${payloadCompleto.Arquivos.length} arquivo(s): ` +
          `tamanhoSolic=${this.tamanhoEmBytes(dtoProtocolo.pdfBase64!)} tamanhoMemo=${this.tamanhoEmBytes(memorandoPdfBase64)}`,
      );

      const etceResponse = await this.etceClient.gerarProtocolo(payloadCompleto);
      if (!etceResponse?.Cod_TCE) {
        throw new Error('Resposta do e-TCE não contém o campo Cod_TCE');
      }
      Cod_TCE = etceResponse.Cod_TCE;
      this.logger.log(
        `e-TCE retornou codTce=${Cod_TCE} (geração única com solicitação + memorando).`,
      );
    } else {
      const payloadPrincipal = this.montarPayload(dtoProtocolo, null);
      this.logger.log(
        `Protocolando solicitação ${solicitacaoId} (PDF principal no /gerar; memorando no anexar): cpf=${dto.interessado.cpf} tamanhoPdf=${this.tamanhoEmBytes(dtoProtocolo.pdfBase64!)}`,
      );

      const etceResponse = await this.etceClient.gerarProtocolo(payloadPrincipal);

      if (!etceResponse?.Cod_TCE) {
        throw new Error('Resposta do e-TCE não contém o campo Cod_TCE');
      }

      Cod_TCE = etceResponse.Cod_TCE;

      this.logger.log(
        `e-TCE retornou codTce=${Cod_TCE} para solicitação=${solicitacaoId} — gerando memorando e anexando`,
      );

      const dadosCi = await this.montarCiMemoriaDadosCompleto(
        solicitacaoId,
        dtoProtocolo,
      );
      const memorandoPdfBase64 = await this.ciMemoriaPdfBuilder.buildBase64(
        dadosCi,
      );
      this.validarTamanhoPdf(memorandoPdfBase64);

      await this.anexarDocumentosAoProtocoloEtce(
        Cod_TCE,
        dtoProtocolo,
        memorandoPdfBase64,
      );

      this.logger.log(
        `Documentos (solicitação + memorando) enviados ao e-TCE no protocolo ${Cod_TCE} — gravando no banco`,
      );
    }

    // 5. Verifica conflito de protocolo
    const conflito = await this.prisma.solicitacao.findFirst({
      where: {
        protocolo: Cod_TCE,
        NOT: { id: solicitacaoId },
      },
      select: { id: true },
    });

    if (conflito) {
      this.logger.error(
        `Cod_TCE ${Cod_TCE} já vinculado à solicitação ${conflito.id}`,
      );
      throw new ConflictException(
        `O protocolo ${Cod_TCE} já está vinculado a outra solicitação (${conflito.id}).`,
      );
    }

    // 6. Update condicional (proteção race condition)
    const { count } = await this.prisma.solicitacao.updateMany({
      where: { id: solicitacaoId, protocolo: null },
      data: { protocolo: Cod_TCE },
    });

    if (count === 0) {
      const atual = await this.prisma.solicitacao.findUnique({
        where: { id: solicitacaoId },
        select: { protocolo: true },
      });

      this.logger.warn(
        `Race condition detectada na solicitação ${solicitacaoId}. ` +
          `Cod_TCE órfão: ${Cod_TCE} | Vencedor: ${atual?.protocolo}`,
      );

      throw new ConflictException(
        `Solicitação protocolada simultaneamente por outra operação. ` +
          `Protocolo vencedor: ${atual?.protocolo}`,
      );
    }

    this.logger.log(
      `✅ Solicitação ${solicitacaoId} protocolada com sucesso: ${Cod_TCE}`,
    );

    return { codTce: Cod_TCE, jaProtocolada: false };
  } catch (error: any) {
    // =============================================
    // 🔥 CAPTURA GLOBAL DE ERROS - ESSA É A PARTE NOVA
    // =============================================
    const errorInfo = {
      message: error.message || 'Erro desconhecido',
      stack: error.stack,
      name: error.name,
      solicitacaoId,
      cpf: dto?.interessado?.cpf,
      payloadSize: dtoProtocolo?.pdfBase64
        ? this.tamanhoEmBytes(dtoProtocolo.pdfBase64)
        : dto?.pdfBase64
          ? this.tamanhoEmBytes(dto.pdfBase64)
          : undefined,
    };

    this.logger.error(
      `❌ ERRO CRÍTICO ao protocolar solicitação ${solicitacaoId}`,
      errorInfo,
    );

    // Se já for uma exceção HTTP do NestJS (NotFound, Conflict, BadGateway, etc.)
    // devolve exatamente a mesma exceção (mantém o status correto)
    if (error instanceof HttpException) {
      throw error;
    }

    // Qualquer outro erro vira 500 + mensagem amigável
    throw new InternalServerErrorException(
      `Erro interno ao gerar protocolo da solicitação ${solicitacaoId}. ` +
        `O erro foi registrado nos logs do servidor.`,
    );
  }
}

  /* async protocolar(
    solicitacaoId: number,
    dto: ProtocolarPdfDto,
  ): Promise<ProtocoloResultado> {
    // 1. Verifica se a solicitação existe e se já foi protocolada
    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id: solicitacaoId },
      select: { id: true, protocolo: true },
    });

    if (!solicitacao) {
      throw new NotFoundException(
        `Solicitação ${solicitacaoId} não encontrada.`,
      );
    }

    // 2. Idempotência forte: se já tem protocolo, retorna sem chamar o e-TCE
    if (solicitacao.protocolo) {
      this.logger.log(
        `Solicitação ${solicitacaoId} já protocolada: ${solicitacao.protocolo}`,
      );
      return { codTce: solicitacao.protocolo, jaProtocolada: true };
    }

    this.validarTamanhoPdf(dto.pdfBase64);

    // 3. Monta payload e chama o e-TCE
    const payload = this.montarPayload(dto);

    this.logger.log(
      `Protocolando solicitação ${solicitacaoId}: cpf=${dto.interessado.cpf} tamanhoPdf=${this.tamanhoEmBytes(dto.pdfBase64)}`,
    );

    const { Cod_TCE } = await this.etceClient.gerarProtocolo(payload);

    // Log do Cod_TCE ANTES do update — se o update falhar por qualquer
    // motivo, esse log é a única trilha pra reconciliação manual.
    this.logger.log(
      `e-TCE retornou codTce=${Cod_TCE} para solicitação=${solicitacaoId} — gravando no banco`,
    );

    // 4. Sanidade: verifica se esse Cod_TCE já está vinculado em outro lugar
    const conflito = await this.prisma.solicitacao.findFirst({
      where: {
        protocolo: Cod_TCE,
        NOT: { id: solicitacaoId },
      },
      select: { id: true },
    });

    if (conflito) {
      this.logger.error(
        `Cod_TCE ${Cod_TCE} já vinculado à solicitação ${conflito.id}, ` +
          `não pode ser vinculado também à ${solicitacaoId}.`,
      );
      throw new ConflictException(
        `O protocolo ${Cod_TCE} já está vinculado a outra solicitação (${conflito.id}). ` +
          `Verifique com o suporte antes de prosseguir.`,
      );
    }

    // 5. Atualiza com update condicional — só grava se ainda estiver null.
    // Protege contra race condition: se outro request gravou entre o passo 1
    // e este ponto, count vem 0 e a gente cai no else.
    const { count } = await this.prisma.solicitacao.updateMany({
      where: { id: solicitacaoId, protocolo: null },
      data: { protocolo: Cod_TCE },
    });

    if (count === 0) {
      // Outro request protocolou no meio do caminho. Pega o que está lá.
      const atual = await this.prisma.solicitacao.findUnique({
        where: { id: solicitacaoId },
        select: { protocolo: true },
      });

      this.logger.warn(
        `Race condition: solicitação ${solicitacaoId} foi protocolada por outro request. ` +
          `Cod_TCE gerado agora (${Cod_TCE}) ficou órfão no e-TCE. ` +
          `Protocolo vencedor: ${atual?.protocolo}`,
      );

      throw new ConflictException(
        `Esta solicitação foi protocolada simultaneamente por outra operação ` +
          `(protocolo: ${atual?.protocolo}). O protocolo ${Cod_TCE} gerado agora ` +
          `ficou órfão no e-TCE e precisa ser tratado manualmente.`,
      );
    }

    this.logger.log(
      `Solicitação ${solicitacaoId} protocolada com sucesso: codTce=${Cod_TCE}`,
    );

    return { codTce: Cod_TCE, jaProtocolada: false };
  } */

  /**
   * Reenvia solicitação + memorando no `anexarArquivos` (corpo em camelCase no client).
   * Algumas instalações substituem a lista de anexos; outras acrescentam — enviamos os 2 juntos.
   */
  private async anexarDocumentosAoProtocoloEtce(
    codTce: string,
    dto: ProtocolarPdfDto,
    memorandoPdfBase64: string,
  ): Promise<void> {
    const cfg = this.config.get('etce.diaria')!;
    const principal = this.arquivoPdfSolicitacaoPrincipal(dto);
    const baseNome = principal.NomeArquivo.replace(/\.pdf$/i, '');
    const memorando: ArquivoProtocolo = {
      Arquivo: this.normalizarBase64PdfEtce(memorandoPdfBase64),
      NomeArquivo: `${baseNome}-memorando-ci.pdf`,
      NomeTipoDocumento: 'MEMORANDO C.I.',
      CodTipoDocumento: cfg.codTipoDocumentoMemorando,
    };

    const arquivos = [principal, memorando];
    this.logger.log(
      `e-TCE anexar: codTce=${codTce} quantidadeArquivos=${arquivos.length} ` +
        `tipos=${arquivos.map((a) => a.CodTipoDocumento).join(',')}`,
    );

    await this.etceClient.anexarArquivosProtocolo({
      Cod_TCE: codTce,
      Arquivos: arquivos,
    });
    this.logger.log(
      `Solicitação + memorando registrados no protocolo e-TCE ${codTce} (2 arquivos).`,
    );
  }

  /** Remove prefixo data URL e espaços — evita rejeição silenciosa do 2º PDF no e-TCE. */
  private normalizarBase64PdfEtce(b64: string): string {
    const t = b64.trim();
    const m = /^data:[^;]+;base64,(.+)$/i.exec(t);
    return (m ? m[1] : t).replace(/\s/g, '');
  }

  private arquivoPdfSolicitacaoPrincipal(dto: ProtocolarPdfDto): ArquivoProtocolo {
    const cfg = this.config.get('etce.diaria')!;
    const nomeArquivo = dto.nomeArquivo.toLowerCase().endsWith('.pdf')
      ? dto.nomeArquivo
      : `${dto.nomeArquivo}.pdf`;
    return {
      Arquivo: this.normalizarBase64PdfEtce(dto.pdfBase64 ?? ''),
      NomeArquivo: nomeArquivo,
      NomeTipoDocumento: 'SOLICITAÇÃO DE DIÁRIA',
      CodTipoDocumento: cfg.codTipoDocumentoSolicitacao,
    };
  }

  private vvPertenceParticipante(
    vv: { participante_id: number | null },
    participanteId: number,
  ): boolean {
    return (
      vv.participante_id == null || vv.participante_id === participanteId
    );
  }

  private extrairDetalheParticipanteNoEvento(
    ep: {
      participante: {
        id: number;
        nome: string;
        cpf: string;
        matricula: number | null;
        cargo: string | null;
        funcao: string | null;
        classe: string | null;
        conta_diaria: Array<{
          cpf: string;
          agencia: string;
          conta: string;
          banco_id: number;
          banco: { banco: string | null } | null;
        }>;
      };
      viagem_participantes: Array<{
        viagem: {
          data_ida: Date;
          data_volta: Date | null;
          valor_passagem: number | null;
          valor_viagem: Array<{
            tipo: string | null;
            valor_individual: number | null;
            participante_id: number | null;
          }>;
        };
      }>;
    },
    evento: { inicio: Date; fim: Date },
  ): CiMemoriaParticipanteDetalhe {
    const part = ep.participante;
    const cpfLimpo = normalizarCpf(part.cpf);
    const contas = part.conta_diaria ?? [];
    const conta =
      contas.find((c) => normalizarCpf(c.cpf) === cpfLimpo) ?? contas[0];
    const bancoNome =
      conta?.banco?.banco != null && String(conta.banco.banco).trim()
        ? `${conta.banco_id} - ${conta.banco.banco}`
        : conta?.banco_id != null
          ? `Código banco ${conta.banco_id}`
          : '—';

    const datasViagem: Date[] = [];
    const vvsDiaria: number[] = [];
    const vvsPassagem: number[] = [];
    let somaPassagemViagem = 0;

    for (const vp of ep.viagem_participantes ?? []) {
      const vg = vp.viagem;
      if (vg?.data_ida) datasViagem.push(new Date(vg.data_ida));
      if (vg?.data_volta) datasViagem.push(new Date(vg.data_volta));
      if (vg?.valor_passagem != null && vg.valor_passagem > 0) {
        somaPassagemViagem += vg.valor_passagem;
      }
      for (const vv of vg?.valor_viagem ?? []) {
        if (!this.vvPertenceParticipante(vv, part.id)) continue;
        const tipo = (vv.tipo ?? '').toUpperCase();
        const val = vv.valor_individual ?? 0;
        if (tipo === 'DIARIA' && val > 0) vvsDiaria.push(val);
        if (tipo === 'PASSAGEM' && val > 0) vvsPassagem.push(val);
      }
    }

    const somaDiarias = vvsDiaria.reduce((a, b) => a + b, 0);
    let somaPassagens = vvsPassagem.reduce((a, b) => a + b, 0);
    if (somaPassagens === 0 && somaPassagemViagem > 0) {
      somaPassagens = somaPassagemViagem;
    }

    const unitDisplay =
      vvsDiaria.length > 0
        ? (() => {
            const map = new Map<number, number>();
            for (const v of vvsDiaria) map.set(v, (map.get(v) ?? 0) + 1);
            let best = vvsDiaria[0];
            let bestc = 0;
            for (const [v, c] of map) {
              if (c > bestc) {
                best = v;
                bestc = c;
              }
            }
            return best;
          })()
        : 0;

    const { min: dMin, max: dMax } = minMaxDatas(datasViagem);
    const periodoViagemEnumerado =
      dMin && dMax
        ? enumerarDiasPeriodoPt(dMin, dMax)
        : enumerarDiasPeriodoPt(new Date(evento.inicio), new Date(evento.fim));

    return {
      nome: part.nome.trim(),
      matricula: part.matricula != null ? String(part.matricula) : '—',
      cargoFuncao:
        [part.cargo, part.funcao].filter(Boolean).join(' — ') ||
        part.cargo ||
        part.funcao ||
        '—',
      classeReferencia: part.classe?.trim() || '—',
      periodoViagemEnumerado,
      diariasContadasTexto: formatarDiariasContadas(somaDiarias, unitDisplay),
      valorDiariaFmt: unitDisplay > 0 ? fmtBrl(unitDisplay) : '—',
      valorTotalDiariasFmt: fmtBrl(somaDiarias),
      bancoLinha: bancoNome,
      agenciaLinha: conta?.agencia ? `AGÊNCIA: ${conta.agencia}` : 'AGÊNCIA: —',
      contaLinha: conta?.conta
        ? `CONTA CORRENTE: ${conta.conta}`
        : 'CONTA CORRENTE: —',
    };
  }

  private textoLocalEvento(evento: {
    exterior: string;
    local_exterior: string | null;
    pais: { nome_pt: string | null } | null;
    cidade: { descricao: string; estado: { uf: string } } | null;
  }): string {
    if (evento.exterior === 'SIM') {
      return (
        `${evento.pais?.nome_pt ?? ''}${evento.local_exterior ? ` — ${evento.local_exterior}` : ''}`.trim() ||
        'exterior'
      );
    }
    const c = evento.cidade?.descricao ?? '';
    const u = evento.cidade?.estado?.uf ?? '';
    return `${c}/${u}`.replace(/^\/|\/$/g, '') || '—';
  }

  private async montarCiMemoriaDadosCompleto(
    solicitacaoId: number,
    dto: ProtocolarPdfDto,
  ): Promise<CiMemoriaPdfDados> {
    const solicitacao = await this.prisma.solicitacao.findUnique({
      where: { id: solicitacaoId },
      include: {
        eventos: {
          orderBy: { inicio: 'asc' },
          include: {
            cidade: { include: { estado: true } },
            pais: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: { include: { banco: true } },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        valor_viagem: true,
                        cidade_destino: { include: { estado: true } },
                        destino: true,
                        cidade_origem: { include: { estado: true } },
                        origem: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!solicitacao?.eventos?.length) {
      throw new BadRequestException('Solicitação sem eventos para montar o memorando.');
    }

    const eventosBlocos: CiMemoriaEventoBloco[] = [];

    for (const evento of solicitacao.eventos) {
      const participantes: CiMemoriaParticipanteDetalhe[] = [];
      for (const ep of evento.evento_participantes) {
        participantes.push(
          this.extrairDetalheParticipanteNoEvento(ep, evento),
        );
      }
      eventosBlocos.push({
        titulo: evento.titulo,
        localTexto: this.textoLocalEvento(evento),
        periodoEventoTexto: formatarPeriodoEventoPt(
          new Date(evento.inicio),
          new Date(evento.fim),
        ),
        participantes,
      });
    }

    let totalDiarias = 0;
    let totalPassagens = 0;

    for (const ev of solicitacao.eventos) {
      for (const ep of ev.evento_participantes) {
        for (const vp of ep.viagem_participantes ?? []) {
          const vg = vp.viagem;
          if (!vg) continue;
          for (const vv of vg.valor_viagem ?? []) {
            if (!this.vvPertenceParticipante(vv, ep.participante.id)) continue;
            const tipo = (vv.tipo ?? '').toUpperCase();
            const val = vv.valor_individual ?? 0;
            if (tipo === 'DIARIA') totalDiarias += val;
            if (tipo === 'PASSAGEM' && val > 0) totalPassagens += val;
          }
        }
      }
    }

    if (totalPassagens === 0) {
      const viagensComPassagemSomada = new Set<number>();
      for (const ev of solicitacao.eventos) {
        for (const ep of ev.evento_participantes) {
          for (const vp of ep.viagem_participantes ?? []) {
            const vg = vp.viagem;
            if (
              !vg?.id ||
              vg.valor_passagem == null ||
              vg.valor_passagem <= 0 ||
              viagensComPassagemSomada.has(vg.id)
            ) {
              continue;
            }
            viagensComPassagemSomada.add(vg.id);
            totalPassagens += vg.valor_passagem;
          }
        }
      }
    }

    const primeiroNacional = solicitacao.eventos.find((e) => e.exterior === 'NAO');
    const sufixoLocalCustos =
      primeiroNacional?.cidade?.descricao &&
      primeiroNacional?.cidade?.estado?.uf
        ? ` à cidade de ${primeiroNacional.cidade.descricao}/${primeiroNacional.cidade.estado.uf}`
        : solicitacao.eventos[0]?.exterior === 'SIM'
          ? ` (${this.textoLocalEvento(solicitacao.eventos[0])})`
          : '';

    const nomesTodos = solicitacao.eventos
      .flatMap((e) => e.evento_participantes.map((x) => x.participante.nome.trim()))
      .filter((n, i, a) => a.indexOf(n) === i);

    const resumoEventos = solicitacao.eventos
      .map(
        (e) =>
          `"${e.titulo}" (${this.textoLocalEvento(e)}; ${formatarPeriodoEventoPt(new Date(e.inicio), new Date(e.fim))})`,
      )
      .join('; ');

    const textoCorpo1 =
      `Cumprimentando Vossa Excelência, encaminho a solicitação de diárias e respectiva apuração, abrangendo o(s) evento(s): ${resumoEventos}. ` +
      `Participantes: ${nomesTodos.join(', ')}.`;

    const textoCorpo2 =
      `Os valores por participante e por evento discriminam-se nas tabelas a seguir, em linha com o conteúdo da solicitação. ` +
      `Segue documentação em anexo (solicitação completa). ` +
      `Solicita-se a anuência para expedição da portaria e pagamento das despesas.`;

    const cpfAss = normalizarCpf(dto.interessado.cpf);
    let cargoAssinatura = '—';
    for (const ev of solicitacao.eventos) {
      for (const ep of ev.evento_participantes) {
        if (normalizarCpf(ep.participante.cpf) === cpfAss) {
          cargoAssinatura =
            [ep.participante.cargo, ep.participante.funcao]
              .filter(Boolean)
              .join(' — ') ||
            ep.participante.cargo ||
            ep.participante.funcao ||
            '—';
          break;
        }
      }
    }

    const valorTotalCustos = totalDiarias + totalPassagens;

    return {
      dataDocumento: new Date(),
      para: 'PRESIDÊNCIA',
      assunto: dto.assunto,
      textoCorpo1,
      textoCorpo2,
      eventos: eventosBlocos,
      valorTotalDiarias: totalDiarias,
      valorTotalPassagens: totalPassagens,
      valorTotalCustos,
      valorTotalDiariasFmt: fmtBrl(totalDiarias),
      extensoDiarias: moedaPorExtensoPtBr(totalDiarias),
      extensoPassagens: moedaPorExtensoPtBr(totalPassagens),
      extensoCustos: moedaPorExtensoPtBr(valorTotalCustos),
      sufixoLocalCustos,
      observacoesExtras: dto.observacoes,
      nomeAssinatura: dto.interessado.nome.trim(),
      cargoAssinatura,
    };
  }

  private montarPayload(
    dto: ProtocolarPdfDto,
    memorandoPdfBase64: string | null,
  ): GerarProtocoloRequest {
    const cfg = this.config.get('etce.diaria')!;
    const principal = this.arquivoPdfSolicitacaoPrincipal(dto);
    const arquivos: ArquivoProtocolo[] = [principal];

    if (memorandoPdfBase64) {
      const baseNome = principal.NomeArquivo.replace(/\.pdf$/i, '');
      arquivos.push({
        Arquivo: this.normalizarBase64PdfEtce(memorandoPdfBase64),
        NomeArquivo: `${baseNome}-memorando-ci.pdf`,
        NomeTipoDocumento: 'MEMORANDO C.I.',
        CodTipoDocumento: cfg.codTipoDocumentoMemorando,
      });
    }

    return {
      Arquivos: arquivos,
      AnoPR: new Date().getFullYear(),
      CodArea: cfg.codArea,
      CodTipoProcesso: cfg.codTipoProcesso,
      CodTipoDocumento: cfg.codTipoDocumentoSolicitacao,
      CodTipoGrupoProtocolo: cfg.codTipoGrupoProtocolo,
      Protocolo: {
        cod_tipo_entrada: cfg.codTipoEntrada,
        num_oficio: dto.numOficio,
        data_oficio: new Date().toISOString(),
        cod_ug: cfg.codUgTceAp,
        sigiloso: false,
        cod_grupo: 0,
        prioritario: dto.prioritario ?? false,
        observacoes: dto.observacoes ?? '',
        eletronico: true,
        assunto: dto.assunto,
        numero_ouvidoria: null,
        cod_tipo_meia_entrega: cfg.codTipoMeiaEntrega,
      },
      Interessados: [
        {
          tipo_pessoa: cfg.tipoPessoaFisica,
          cpf: dto.interessado.cpf,
          nome: dto.interessado.nome,
          cod_tipo_interessado: cfg.codTipoInteressadoServidor,
          cod_tipo_qualificacao: cfg.codTipoQualificacaoServidor,
          representante_legal_advogado: false,
        },
      ],
    };
  }

  /**
   * O e-TCE exige `Protocolo.cod_ug` (Unidade Gestora). O default em `etce.config`
   * é 0, que a API rejeita com "CÓDIGO UG OBRIGATÓRIO".
   */
  private validarCodUgEtce(): void {
    const cfg = this.config.get<{ codUgTceAp: number }>('etce.diaria');
    const ug = cfg?.codUgTceAp;
    if (ug == null || Number.isNaN(ug) || ug <= 0) {
      throw new InternalServerErrorException(
        'Configure ETCE_DIARIA_COD_UG_TCE_AP no ambiente com o código UG válido do e-TCE (inteiro > 0).',
      );
    }
  }

  private validarTamanhoPdf(pdfBase64: string): void {
    const bytes = this.tamanhoEmBytes(pdfBase64);
    if (bytes > MAX_PDF_BYTES) {
      throw new BadRequestException(`PDF excede 10 MB (${bytes} bytes)`);
    }
  }

  private tamanhoEmBytes(pdfBase64: string): number {
    const padding = (pdfBase64.match(/=+$/) || [''])[0].length;
    return Math.floor((pdfBase64.length * 3) / 4) - padding;
  }
}