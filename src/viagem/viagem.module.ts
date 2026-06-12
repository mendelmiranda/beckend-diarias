import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { PrismaService } from 'prisma/prisma.service';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { CidadeService } from '../cidade/cidade.service';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import { AeroportoService } from '../aeroporto/aeroporto.service';
import { CargoDiariasService } from '../cargo_diarias/cargo_diarias.service';
import { ValorViagemService } from 'src/valor_viagem/valor_viagem.service';
import { EventoService } from 'src/evento/evento.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { SolicitacaoModule } from 'src/solicitacao/solicitacao.module';
import { ValorDiariasModule } from 'src/valor_diarias/valor_diarias.module';

@Module({
  imports: [SolicitacaoModule, ValorDiariasModule],
  controllers: [ViagemController],
  providers: [
    ViagemService,
    PrismaService,
    ViagemParticipantesService,
    CidadeService,
    EventoParticipantesService,
    AeroportoService,
    CargoDiariasService,
    ValorViagemService,
    EventoService,
    LogSistemaService,
  ],
  exports: [ViagemService],
})
export class ViagemModule {}
