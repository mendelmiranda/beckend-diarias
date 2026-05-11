import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { GerarProtocoloRequest, GerarProtocoloResponse } from './gerar-protocolo.dto';

@Injectable()
export class ETceProtocoloClient {
  private readonly logger = new Logger(ETceProtocoloClient.name);

  constructor(private readonly http: HttpService) {}

  async gerarProtocolo(payload: GerarProtocoloRequest): Promise<GerarProtocoloResponse> {
    const { data } = await firstValueFrom(
      this.http
        .post<GerarProtocoloResponse>('/api/protocolo/gerar', payload)
        .pipe(
          catchError((err: AxiosError) => {
            const status = err.response?.status;
            const body = err.response?.data;
            this.logger.error(
              `Falha no POST /api/protocolo/gerar [${status}]: ${JSON.stringify(body)}`,
            );
            throw new ServiceUnavailableException(
              `e-TCE rejeitou o protocolo (${status ?? 'sem resposta'})`,
            );
          }),
        ),
    );

    if (!data?.Cod_TCE) {
      throw new ServiceUnavailableException('e-TCE não retornou Cod_TCE');
    }

    return data;
  }
}