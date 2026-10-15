import {
  BadGatewayException,
  ForbiddenException,
  HttpException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export type RhVinculo = {
  matricula: string | null;
  ativo: boolean | null;
};

export type RhPessoa = {
  nome: string | null;
  usuario: string | null;
  vinculos: RhVinculo[] | null;
};

type TokenResponse = {
  access_token: string;
  expires_in?: number;
};

type GraphqlResponse = {
  data?: { rhPessoa?: RhPessoa | null };
  errors?: { message?: string }[];
};

const RH_PESSOA_QUERY = `
  query RhPessoa($cpf: String!) {
    rhPessoa(cpf: $cpf) {
      nome
      usuario
      vinculos {
        matricula
        ativo
      }
    }
  }
`;

@Injectable()
export class TceApiClient {
  private cached: { accessToken: string; expiresAt: number } | null = null;
  private tokenPromise: Promise<string> | null = null;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async consultarServidorPorCpf(
    cpf: string,
    retried = false,
  ): Promise<RhPessoa | null> {
    const token = await this.getAccessToken(retried);

    try {
      const { data } = await firstValueFrom(
        this.http.post<GraphqlResponse>(
          this.config.get<string>('tceApi.graphqlUrl'),
          { query: RH_PESSOA_QUERY, variables: { cpf } },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (data?.errors?.length) {
        throw new BadGatewayException(this.mensagensGraphql(data.errors));
      }

      return data?.data?.rhPessoa ?? null;
    } catch (err) {
      if (err instanceof HttpException) throw err;

      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;

      if (status === 401 && !retried) {
        this.cached = null;
        return this.consultarServidorPorCpf(cpf, true);
      }

      const mensagem = this.mensagemHttp(axiosErr);

      if (status === 401) throw new UnauthorizedException(mensagem);
      if (status === 403) throw new ForbiddenException(mensagem);

      throw new BadGatewayException(mensagem);
    }
  }

  private async getAccessToken(force = false): Promise<string> {
    if (!force && this.cached && this.cached.expiresAt > Date.now()) {
      return this.cached.accessToken;
    }

    if (!force && this.tokenPromise) return this.tokenPromise;

    const pending = this.fetchToken().finally(() => {
      if (this.tokenPromise === pending) this.tokenPromise = null;
    });
    this.tokenPromise = pending;
    return pending;
  }

  private async fetchToken(): Promise<string> {
    const clientId = this.config.get<string>('tceApi.clientId') ?? '';
    const clientSecret = this.config.get<string>('tceApi.clientSecret') ?? '';

    if (!clientId || !clientSecret) {
      throw new ServiceUnavailableException(
        'Credenciais da API do TCE não configuradas (TCE_API_CLIENT_ID / TCE_API_CLIENT_SECRET).',
      );
    }

    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    });

    try {
      const { data } = await firstValueFrom(
        this.http.post<TokenResponse>(
          this.config.get<string>('tceApi.tokenUrl'),
          body.toString(),
          {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          },
        ),
      );

      const expiresIn = data.expires_in ?? 300;
      this.cached = {
        accessToken: data.access_token,
        expiresAt: Date.now() + Math.max(0, expiresIn - 30) * 1000,
      };

      return data.access_token;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadGatewayException(this.mensagemHttp(err as AxiosError));
    }
  }

  private mensagensGraphql(errors: { message?: string }[]): string {
    const texto = errors
      .map((erro) => erro.message?.trim())
      .filter((mensagem): mensagem is string => Boolean(mensagem))
      .join('; ');

    return texto || 'A API do TCE retornou um erro GraphQL.';
  }

  private mensagemHttp(err: AxiosError): string {
    const data = err.response?.data;

    if (typeof data === 'string' && data.trim()) return data;
    if (data && typeof data === 'object') {
      const corpo = data as { message?: string; error_description?: string; error?: string };
      if (corpo.message) return corpo.message;
      if (corpo.error_description) return corpo.error_description;
      if (corpo.error) return corpo.error;
    }

    return err.message || 'Falha ao consultar a API do TCE.';
  }
}
