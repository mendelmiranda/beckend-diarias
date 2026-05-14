import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
  AnexarArquivosProtocoloRequest,
  GerarProtocoloRequest,
  GerarProtocoloResponse,
} from './gerar-protocolo.dto';

@Injectable()
export class ETceProtocoloClient {
  private readonly logger = new Logger(ETceProtocoloClient.name);

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async gerarProtocolo(
    payload: GerarProtocoloRequest,
  ): Promise<GerarProtocoloResponse> {
    const camelGerarExplicit =
      this.config.get<boolean>('etce.httpJsonCamelGerar') === true;
    const useCamelGerar =
      camelGerarExplicit || payload.Arquivos.length > 1;
    const body = useCamelGerar
      ? this.corpoGerarProtocoloCamelCase(payload)
      : payload;

    const { data } = await firstValueFrom(
      this.http
        .post<GerarProtocoloResponse>('/api/protocolo/gerar', body)
        .pipe(
          catchError((err: AxiosError) =>
            throwError(() => this.mapearErroETce(err)),
          ),
        ),
    );

    if (!data?.Cod_TCE) {
      this.logger.error('e-TCE retornou 200 mas sem Cod_TCE', { data });
      throw new BadGatewayException(
        'e-TCE retornou resposta inválida (sem Cod_TCE).',
      );
    }

    return data;
  }

  private corpoGerarProtocoloCamelCase(
    payload: GerarProtocoloRequest,
  ): Record<string, unknown> {
    return {
      arquivos: payload.Arquivos.map((a) => ({
        arquivo: a.Arquivo,
        nomeArquivo: a.NomeArquivo,
        nomeTipoDocumento: a.NomeTipoDocumento,
        codTipoDocumento: a.CodTipoDocumento,
      })),
      anoPR: payload.AnoPR,
      codArea: payload.CodArea,
      codTipoProcesso: payload.CodTipoProcesso,
      codTipoDocumento: payload.CodTipoDocumento,
      codTipoGrupoProtocolo: payload.CodTipoGrupoProtocolo,
      protocolo: payload.Protocolo,
      interessados: payload.Interessados,
    };
  }

  private static readonly ROTAS_ANEXAR_FALLBACK = [
    '/api/protocolo/anexarArquivos',
    '/api/Protocolo/AnexarArquivos',
    '/api/protocolo/AnexarArquivos',
    '/api/Protocolo/AdicionarArquivosProtocolo',
    '/api/protocolo/adicionarArquivosProtocolo',
  ];

  /**
   * Anexa PDF(s) a um protocolo já criado (memorando com número do Cod_TCE).
   * Tenta a rota configurada e fallbacks comuns em ASP.NET (404 em uma tenta a próxima).
   */
  async anexarArquivosProtocolo(
    body: AnexarArquivosProtocoloRequest,
  ): Promise<void> {
    const configured =
      this.config.get<string>('etce.anexarArquivosPath')?.trim() ||
      ETceProtocoloClient.ROTAS_ANEXAR_FALLBACK[0];
    const extras =
      this.config.get<string[]>('etce.anexarArquivosPathCandidatesList') ?? [];
    const ordered = [
      ...new Set([
        configured,
        ...extras,
        ...ETceProtocoloClient.ROTAS_ANEXAR_FALLBACK,
      ]),
    ];

    const useCamel =
      this.config.get<boolean>('etce.httpJsonCamelAnexar') !== false;
    const payload = useCamel
      ? this.corpoAnexarArquivosCamelCase(body)
      : body;

    let last404 = false;
    for (const path of ordered) {
      try {
        await firstValueFrom(
          this.http.post(path, payload).pipe(
            catchError((err: AxiosError) => throwError(() => err)),
          ),
        );
        this.logger.log(`e-TCE anexar arquivos OK: POST ${path}`);
        return;
      } catch (e: unknown) {
        const err = e as AxiosError;
        const st = err.response?.status;
        if (st === 404) {
          last404 = true;
          this.logger.warn(`e-TCE anexar 404 em ${path}, tentando outra rota…`);
          continue;
        }
        throw this.mapearErroETce(err);
      }
    }

    if (last404) {
      throw new NotFoundException(
        `e-TCE: nenhuma rota de anexo respondeu (404). Tentadas: ${ordered.join(' | ')}. ` +
          `Ajuste ETCE_PROTOCOLO_ANEXAR_PATH (ou ETCE_PROTOCOLO_ANEXAR_PATH_CANDIDATES) conforme o integrador, ` +
          `ou use o envio dos 2 PDFs só no POST /gerar (padrão: não defina ETCE_PROTOCOLO_GERAR_COM_DOIS_PDFS_CI_NUM_OFICIO=false).`,
      );
    }
  }

  /** Corpo JSON em camelCase para binding ASP.NET Core (lista `arquivos`, `cod_TCE`, …). */
  private corpoAnexarArquivosCamelCase(
    body: AnexarArquivosProtocoloRequest,
  ): Record<string, unknown> {
    return {
      cod_TCE: body.Cod_TCE,
      arquivos: body.Arquivos.map((a) => ({
        arquivo: a.Arquivo,
        nomeArquivo: a.NomeArquivo,
        nomeTipoDocumento: a.NomeTipoDocumento,
        codTipoDocumento: a.CodTipoDocumento,
      })),
    };
  }

  private mapearErroETce(err: AxiosError): HttpException {
    // 1. Conexão recusada / DNS / rede caiu — e-TCE está offline ou inalcançável
    if (!err.response) {
      const code = err.code;

      if (code === 'ECONNABORTED' || code === 'ETIMEDOUT') {
        this.logger.error(`Timeout chamando e-TCE [${code}]: ${err.message}`);
        return new GatewayTimeoutException(
          'O e-TCE não respondeu no tempo esperado. Tente novamente em alguns minutos.',
        );
      }

      this.logger.error(
        `Falha de conexão com e-TCE [${code}]: ${err.message}`,
      );
      return new ServiceUnavailableException(
        'O e-TCE está indisponível no momento. Tente novamente em alguns minutos.',
      );
    }

    // 2. e-TCE respondeu com erro HTTP
    const status = err.response.status;
    const body = err.response.data;
    const mensagemETce = this.extrairMensagemETce(body);

    this.logger.error(
      `e-TCE rejeitou [${status}]: ${JSON.stringify(body)}`,
    );

    // 4xx do e-TCE = problema com o que enviamos. Repassa como 422 pro front
    // entender que não adianta tentar de novo sem mudar a entrada.
    if (status >= 400 && status < 500) {
      let msg = mensagemETce;
      if (
        status === 404 &&
        typeof body === 'string' &&
        body.includes('<!DOCTYPE')
      ) {
        const m = body.match(/Requested URL:\s*<\/b>([^<]+)/i);
        msg = m
          ? `rota não encontrada (404): ${m[1].trim()}`
          : 'rota não encontrada (404) — resposta HTML do servidor ASP.NET';
      }
      return new UnprocessableEntityException(
        `O e-TCE rejeitou a solicitação: ${msg}`,
      );
    }

    // 5xx do e-TCE = problema do lado deles
    return new BadGatewayException(
      `O e-TCE retornou erro interno: ${mensagemETce}`,
    );
  }

  private extrairMensagemETce(body: unknown): string {
    if (typeof body === 'string') return body;
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      // Conforme a doc, erro 500 do e-TCE: { Exception, InnerException }
      if (typeof b.Exception === 'string') return b.Exception;
      if (typeof b.Mensagem === 'string') return b.Mensagem;
      if (typeof b.message === 'string') return b.message;
      // ASP.NET Web API 400: { Message, ModelState }
      if (typeof b.Message === 'string' && b.ModelState && typeof b.ModelState === 'object') {
        const msgs = this.flattenModelState(b.ModelState as Record<string, unknown>);
        if (msgs.length > 0) {
          return `${b.Message}: ${msgs.join(' | ')}`;
        }
        return b.Message;
      }
      if (typeof b.Message === 'string') return b.Message;
    }
    return 'erro não detalhado';
  }

  private flattenModelState(modelState: Record<string, unknown>): string[] {
    const out: string[] = [];
    for (const value of Object.values(modelState)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          if (typeof item === 'string' && item.trim()) out.push(item.trim());
        }
      } else if (typeof value === 'string' && value.trim()) {
        out.push(value.trim());
      }
    }
    return out;
  }
}