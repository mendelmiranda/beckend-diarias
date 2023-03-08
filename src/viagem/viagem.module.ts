import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { CidadeService } from '../cidade/cidade.service';
import { ParticipanteService } from '../participante/participante.service';

@Module({
  controllers: [ViagemController],
  providers: [ViagemService, PrismaService, ViagemParticipantesService, CidadeService, ParticipanteService],
})
export class ViagemModule {}
