import { Module } from '@nestjs/common';
import { CorrecaoSolicitacaoService } from './correcao_solicitacao.service';
import { CorrecaoSolicitacaoController } from './correcao_solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CorrecaoSolicitacaoController],
  providers: [CorrecaoSolicitacaoService, PrismaService]
})
export class CorrecaoSolicitacaoModule {}
