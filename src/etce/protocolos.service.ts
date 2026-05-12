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
import { GerarProtocoloRequest } from './gerar-protocolo.dto';


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
  ) {}

  async protocolar( solicitacaoId: number, dto: ProtocolarPdfDto,): Promise<ProtocoloResultado> {
  this.logger.log(`🚀 Iniciando protocolar - solicitaçãoId: ${solicitacaoId}`);

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

    // 3. Validações locais
    this.validarTamanhoPdf(dto.pdfBase64);

    const payload = this.montarPayload(dto);

    this.logger.log(
      `Protocolando solicitação ${solicitacaoId}: cpf=${dto.interessado.cpf} tamanhoPdf=${this.tamanhoEmBytes(dto.pdfBase64)}`,
    );

    // 4. Chamada ao e-TCE
    const etceResponse = await this.etceClient.gerarProtocolo(payload);

    if (!etceResponse?.Cod_TCE) {
      throw new Error('Resposta do e-TCE não contém o campo Cod_TCE');
    }

    const Cod_TCE = etceResponse.Cod_TCE;

    this.logger.log(
      `e-TCE retornou codTce=${Cod_TCE} para solicitação=${solicitacaoId} — gravando no banco`,
    );

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
      payloadSize: dto?.pdfBase64
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

  private montarPayload(dto: ProtocolarPdfDto): GerarProtocoloRequest {
    const cfg = this.config.get('etce.diaria')!;
    const nomeArquivo = dto.nomeArquivo.toLowerCase().endsWith('.pdf')
      ? dto.nomeArquivo
      : `${dto.nomeArquivo}.pdf`;

    return {
      Arquivos: [
        {
          Arquivo: dto.pdfBase64,
          NomeArquivo: nomeArquivo,
          NomeTipoDocumento: 'SOLICITAÇÃO DE DIÁRIA',
          CodTipoDocumento: cfg.codTipoDocumento,
        },
      ],
      AnoPR: new Date().getFullYear(),
      CodArea: cfg.codArea,
      CodTipoProcesso: cfg.codTipoProcesso,
      CodTipoDocumento: cfg.codTipoDocumento,
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