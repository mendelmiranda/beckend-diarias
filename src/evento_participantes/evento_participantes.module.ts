import { Module } from '@nestjs/common';
import { EventoParticipantesService } from './evento_participantes.service';
import { EventoParticipantesController } from './evento_participantes.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [EventoParticipantesController],
  providers: [EventoParticipantesService, PrismaService]
})
export class EventoParticipantesModule {}
