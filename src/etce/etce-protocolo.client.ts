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
    const useCamelGerar =
      this.config.get<boolean>('etce.httpJsonCamelGerar') === true;
    const body = useCamelGerar
      ? this.corpoGerarProtocoloCamelCase(payload)
      : payload;
    this.logMetadadosGerar(payload, useCamelGerar);

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

    // 5xx do e-TCE = problema do lado deles (ASP.NET muitas vezes só devolve
    // "An error has occurred." sem ExceptionMessage)
    const generica = /an error has occurred\.?/i.test(mensagemETce);
    if (generica) {
      return new BadGatewayException(this.mensagemErroInternoGenerico());
    }
    return new BadGatewayException(
      `O e-TCE retornou erro interno: ${mensagemETce}`,
    );
  }

  private logMetadadosGerar(
    payload: GerarProtocoloRequest,
    useCamelGerar: boolean,
  ): void {
    const jwt = this.inspecionarBearer();
    if (!jwt.presente) {
      this.logger.warn(
        'ETCE_BEARER_TOKEN ausente. Configure um token válido no .env.',
      );
    } else if (jwt.expired) {
      this.logger.warn(
        `ETCE_BEARER_TOKEN vencido em ${jwt.expIso}. Atualize o token no .env (não logamos o valor).`,
      );
    } else if (jwt.expIso) {
      this.logger.log(`ETCE_BEARER_TOKEN com exp em ${jwt.expIso}`);
    } else {
      this.logger.warn(
        'ETCE_BEARER_TOKEN presente, mas sem campo exp (não foi possível validar validade).',
      );
    }

    const tamanhos = payload.Arquivos.map((a) =>
      this.tamanhoEmBytesBase64(a.Arquivo),
    );
    const tiposDoc = payload.Arquivos.map((a) => a.CodTipoDocumento).join(',');
    this.logger.log(
      `e-TCE POST /gerar JSON=${useCamelGerar ? 'camelCase' : 'PascalCase'} ` +
        `arquivos=${payload.Arquivos.length} tamanhosBytes=[${tamanhos.join(',')}] ` +
        `AnoPR=${payload.AnoPR} CodArea=${payload.CodArea} ` +
        `CodTipoProcesso=${payload.CodTipoProcesso} CodTipoDocumento=${payload.CodTipoDocumento} ` +
        `CodTipoGrupoProtocolo=${payload.CodTipoGrupoProtocolo} ` +
        `cod_ug=${payload.Protocolo.cod_ug} cod_tipo_entrada=${payload.Protocolo.cod_tipo_entrada} ` +
        `tiposDoc=[${tiposDoc}]`,
    );
  }

  private inspecionarBearer(): {
    presente: boolean;
    expired: boolean;
    expIso: string | null;
  } {
    const raw = this.config.get<string>('etce.bearerToken')?.trim() ?? '';
    if (!raw) {
      return { presente: false, expired: false, expIso: null };
    }
    const token = raw.replace(/^Bearer\s+/i, '');
    const partes = token.split('.');
    if (partes.length < 2) {
      return { presente: true, expired: false, expIso: null };
    }
    try {
      const json = Buffer.from(
        partes[1].replace(/-/g, '+').replace(/_/g, '/'),
        'base64',
      ).toString('utf8');
      const payload = JSON.parse(json) as { exp?: unknown };
      if (typeof payload.exp !== 'number') {
        return { presente: true, expired: false, expIso: null };
      }
      const expMs = payload.exp * 1000;
      return {
        presente: true,
        expired: expMs < Date.now(),
        expIso: new Date(expMs).toISOString(),
      };
    } catch {
      return { presente: true, expired: false, expIso: null };
    }
  }

  private mensagemErroInternoGenerico(): string {
    const jwt = this.inspecionarBearer();
    if (!jwt.presente) {
      return (
        'O e-TCE falhou internamente ao gerar o protocolo. ' +
        'O token de acesso (ETCE_BEARER_TOKEN) não está configurado. ' +
        'Peça um token válido ao suporte do e-TCE e atualize o ambiente.'
      );
    }
    if (jwt.expired) {
      return (
        'O e-TCE falhou internamente ao gerar o protocolo. ' +
        `O token de acesso (ETCE_BEARER_TOKEN) está vencido` +
        (jwt.expIso ? ` desde ${jwt.expIso}` : '') +
        '. Atualize o token no ambiente e tente novamente. ' +
        'Se persistir, acione o suporte do e-TCE.'
      );
    }
    return (
      'O e-TCE falhou internamente ao gerar o protocolo e não informou o detalhe do erro. ' +
      'Os PDFs foram gerados neste sistema; o problema está no serviço e-TCE. ' +
      'Tente novamente em alguns minutos. Se persistir, acione o suporte do e-TCE.'
    );
  }

  private tamanhoEmBytesBase64(b64: string): number {
    const t = b64.trim();
    const padding = (t.match(/=+$/) || [''])[0].length;
    return Math.floor((t.length * 3) / 4) - padding;
  }

  private extrairMensagemETce(body: unknown): string {
    if (typeof body === 'string') {
      const semHtml = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return semHtml || body;
    }
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      const inner = this.textoExcecaoAspNet(b.InnerException);
      const detalhes = [
        this.textoExcecaoAspNet(b.ExceptionMessage),
        this.textoExcecaoAspNet(b.Exception),
        inner,
        typeof b.Mensagem === 'string' ? b.Mensagem : null,
        typeof b.message === 'string' ? b.message : null,
      ].filter((s): s is string => !!s && !/an error has occurred\.?/i.test(s));

      if (typeof b.Message === 'string' && b.ModelState && typeof b.ModelState === 'object') {
        const msgs = this.flattenModelState(b.ModelState as Record<string, unknown>);
        if (msgs.length > 0) {
          return `${b.Message}: ${msgs.join(' | ')}`;
        }
      }

      if (detalhes.length > 0) return detalhes.join(' — ');
      if (typeof b.Message === 'string' && b.Message.trim()) return b.Message;
    }
    return 'erro não detalhado';
  }

  private textoExcecaoAspNet(value: unknown): string | null {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (value && typeof value === 'object') {
      const o = value as Record<string, unknown>;
      if (typeof o.ExceptionMessage === 'string' && o.ExceptionMessage.trim()) {
        return o.ExceptionMessage.trim();
      }
      if (typeof o.Message === 'string' && o.Message.trim()) return o.Message.trim();
    }
    return null;
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