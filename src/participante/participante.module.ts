import { Module } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { ParticipanteController } from './participante.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ContaDiariaService } from 'src/conta_diaria/conta_diaria.service';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';

@Module({
  controllers: [ParticipanteController],
  providers: [ParticipanteService, PrismaService, ContaDiariaService, EventoParticipantesService],
})
export class ParticipanteModule {}
