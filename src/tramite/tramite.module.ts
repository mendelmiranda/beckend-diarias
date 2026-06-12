import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteController } from './tramite.controller';
import { TramiteService } from './tramite.service';
import { LogTramiteService } from 'src/log_tramite/log_tramite.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { HttpModule } from '@nestjs/axios';
import { TramiteContadorController } from './tramite.contator.controller';
import { SolicitacaoModule } from 'src/solicitacao/solicitacao.module';
import { ViagemModule } from 'src/viagem/viagem.module';

@Module({
  controllers: [TramiteController, TramiteContadorController],
  providers: [TramiteService, PrismaService, LogTramiteService, EmailService],
  imports: [EmailModule, HttpModule, SolicitacaoModule, ViagemModule],
})
export class TramiteModule {}
