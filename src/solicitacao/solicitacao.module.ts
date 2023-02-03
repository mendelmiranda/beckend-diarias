import { Module } from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { SolicitacaoController } from './solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [SolicitacaoController],
  providers: [SolicitacaoService, PrismaService],
})
export class SolicitacaoModule {}
