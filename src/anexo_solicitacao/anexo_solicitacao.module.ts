import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AnexoSolicitacaoController } from './anexo_solicitacao.controller';
import { AnexoSolicitacaoService } from './anexo_solicitacao.service';

@Module({
  controllers: [AnexoSolicitacaoController],
  providers: [AnexoSolicitacaoService, PrismaService],
  exports: [AnexoSolicitacaoService],
  imports: [HttpModule]
})
export class AnexoSolicitacaoModule {}
