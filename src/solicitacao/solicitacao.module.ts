import { Module } from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { SolicitacaoController } from './solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaService } from '../log_sistema/log_sistema.service';

@Module({
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService, PrismaService, LogSistemaService],
})
export class SolicitacaoModule {}
