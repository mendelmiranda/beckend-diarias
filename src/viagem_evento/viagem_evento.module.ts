import { Module } from '@nestjs/common';
import { ViagemEventoService } from './viagem_evento.service';
import { ViagemEventoController } from './viagem_evento.controller';
import { PrismaService } from 'prisma/prisma.service';


@Module({
  controllers: [ViagemEventoController],
  providers: [ViagemEventoService, PrismaService],
})
export class ViagemEventoModule {}
