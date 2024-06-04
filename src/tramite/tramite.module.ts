import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteController } from './tramite.controller';
import { TramiteService } from './tramite.service';
import { LogTramiteService } from 'src/log_tramite/log_tramite.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { ViagemService } from 'src/viagem/viagem.service';
import { CidadeService } from 'src/cidade/cidade.service';
import { AeroportoService } from 'src/aeroporto/aeroporto.service';
import { EventoParticipantesService } from 'src/evento_participantes/evento_participantes.service';
import { CargoDiariasService } from 'src/cargo_diarias/cargo_diarias.service';
import { ValorViagemService } from 'src/valor_viagem/valor_viagem.service';
import { EventoService } from 'src/evento/evento.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';


@Module({
  controllers: [TramiteController],
  providers: [TramiteService, PrismaService, LogTramiteService, EmailService, ViagemService, CidadeService, AeroportoService, EventoParticipantesService, CargoDiariasService, ValorViagemService,
  EventoService, LogSistemaService],
  imports: [EmailModule, HttpModule]
})
export class TramiteModule {}
