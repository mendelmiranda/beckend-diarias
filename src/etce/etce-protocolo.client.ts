import {
  BadGatewayException,
  GatewayTimeoutException,
  HttpException,
  Injectable,
  Logger,
  ServiceUnavailableException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import {
  GerarProtocoloRequest,
  GerarProtocoloResponse,
} from './gerar-protocolo.dto';

@Injectable()
export class ETceProtocoloClient {
  private readonly logger = new Logger(ETceProtocoloClient.name);

  constructor(private readonly http: HttpService) {}

  async gerarProtocolo(
    payload: GerarProtocoloRequest,
  ): Promise<GerarProtocoloResponse> {
    const { data } = await firstValueFrom(
      this.http
        .post<GerarProtocoloResponse>('/api/protocolo/gerar', payload)
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
      return new UnprocessableEntityException(
        `O e-TCE rejeitou a solicitação: ${mensagemETce}`,
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
    }
    return 'erro não detalhado';
  }
}