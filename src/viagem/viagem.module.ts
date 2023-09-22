import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { CidadeService } from '../cidade/cidade.service';
import { ParticipanteService } from '../participante/participante.service';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import { AeroportoService } from '../aeroporto/aeroporto.service';
import { CargoDiariasService } from '../cargo_diarias/cargo_diarias.service';
import { ValorViagemService } from 'src/valor_viagem/valor_viagem.service';
import { EventoService } from 'src/evento/evento.service';

@Module({
  controllers: [ViagemController],
  providers: [ViagemService, PrismaService, ViagemParticipantesService, 
    CidadeService, ParticipanteService, EventoParticipantesService, AeroportoService, CargoDiariasService, ValorViagemService, EventoService],
  exports: [ViagemService],
})
export class ViagemModule {}
