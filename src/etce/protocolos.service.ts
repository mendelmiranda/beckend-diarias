import {
  BadRequestException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ETceProtocoloClient } from '../etce/etce-protocolo.client';
import { GerarProtocoloRequest } from './gerar-protocolo.dto';
import { ProtocolarPdfDto } from './protocolar-pdf.dto';

const MAX_PDF_BYTES = 10 * 1024 * 1024;

@Injectable()
export class ProtocolosService {
  private readonly logger = new Logger(ProtocolosService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly etceClient: ETceProtocoloClient,
  ) {}

  async protocolar(dto: ProtocolarPdfDto): Promise<string> {
    this.validarTamanhoPdf(dto.pdfBase64);

    const cfg = this.config.get('etce.diaria')!;
    const nomeArquivo = dto.nomeArquivo.toLowerCase().endsWith('.pdf')
      ? dto.nomeArquivo
      : `${dto.nomeArquivo}.pdf`;

    const payload: GerarProtocoloRequest = {
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

    this.logger.log(
      `Protocolando: numOficio=${dto.numOficio} cpf=${dto.interessado.cpf} tamanhoPdf=${this.tamanhoEmBytes(dto.pdfBase64)}`,
    );

    // Se o e-TCE der erro, o client já lança a exception correta —
    // não precisa try/catch aqui, deixa propagar.
    const { Cod_TCE } = await this.etceClient.gerarProtocolo(payload);

    this.logger.log(
      `Protocolado com sucesso: codTce=${Cod_TCE} numOficio=${dto.numOficio}`,
    );

    return Cod_TCE;
  }

  private validarTamanhoPdf(pdfBase64: string): void {
    const bytes = this.tamanhoEmBytes(pdfBase64);
    if (bytes > MAX_PDF_BYTES) {
      throw new BadRequestException(
        `PDF excede 10 MB (${bytes} bytes)`,
      );
    }
  }

  private tamanhoEmBytes(pdfBase64: string): number {
    const padding = (pdfBase64.match(/=+$/) || [''])[0].length;
    return Math.floor((pdfBase64.length * 3) / 4) - padding;
  }
}