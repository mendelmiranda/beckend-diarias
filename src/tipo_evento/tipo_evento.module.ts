import { CacheModule, Module } from '@nestjs/common';
import { TipoEventoService } from './tipo_evento.service';
import { TipoEventoController } from './tipo_evento.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [TipoEventoController],
  providers: [TipoEventoService, PrismaService],
  imports: [CacheModule.register()]
})
export class TipoEventoModule {}
