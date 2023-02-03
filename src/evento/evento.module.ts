import { Module } from '@nestjs/common';
import { EventoService } from './evento.service';
import { EventoController } from './evento.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [EventoController],
  providers: [EventoService, PrismaService],
})
export class EventoModule {}
