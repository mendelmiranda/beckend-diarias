import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ETceProtocoloClient } from './etce-protocolo.client';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const raw = config.get<string>('etce.bearerToken')?.trim() ?? '';
        const authorization =
          raw.length === 0
            ? undefined
            : raw.toLowerCase().startsWith('bearer ')
              ? raw
              : `Bearer ${raw}`;

        return {
          baseURL: config.get<string>('etce.baseUrl'),
          timeout: config.get<number>('etce.timeoutMs'),
          // PDF em base64 estoura o default de 10MB do axios — sobe pra 20MB
          maxBodyLength: 20 * 1024 * 1024,
          maxContentLength: 20 * 1024 * 1024,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(authorization ? { Authorization: authorization } : {}),
          },
        };
      },
    }),
  ],
  providers: [ETceProtocoloClient],
  exports: [ETceProtocoloClient],
})
export class ETceModule {}