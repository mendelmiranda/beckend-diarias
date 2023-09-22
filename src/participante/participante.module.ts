import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { ContaDiariaModule } from 'src/conta_diaria/conta_diaria.module';
import { EventoModule } from 'src/evento/evento.module';
import { EventoParticipantesModule } from 'src/evento_participantes/evento_participantes.module';
import { ViagemModule } from 'src/viagem/viagem.module';
import { ParticipanteController } from './participante.controller';
import { ParticipanteService } from './participante.service';

@Module({
  controllers: [ParticipanteController],
  providers: [ParticipanteService],
  imports: [PrismaModule, ContaDiariaModule, EventoParticipantesModule, EventoModule, ViagemModule],
  
})
export class ParticipanteModule {}
