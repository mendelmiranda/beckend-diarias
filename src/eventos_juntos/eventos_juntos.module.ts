import { Module } from '@nestjs/common';
import { EventosJuntosService } from './eventos_juntos.service';
import { EventosJuntosController } from './eventos_juntos.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [EventosJuntosController],
  providers: [EventosJuntosService, PrismaService]
})
export class EventosJuntosModule {}
