import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { CidadeService } from '../cidade/cidade.service';
import { ParticipanteService } from '../participante/participante.service';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import { AeroportoService } from '../aeroporto/aeroporto.service';

@Module({
  controllers: [ViagemController],
  providers: [ViagemService, PrismaService, ViagemParticipantesService, 
    CidadeService, ParticipanteService, EventoParticipantesService, AeroportoService,],
})
export class ViagemModule {}
