import { Module } from '@nestjs/common';
import { AnexoSolicitacaoService } from './anexo_solicitacao.service';
import { AnexoSolicitacaoController } from './anexo_solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AnexoSolicitacaoController],
  providers: [AnexoSolicitacaoService, PrismaService]
})
export class AnexoSolicitacaoModule {}
