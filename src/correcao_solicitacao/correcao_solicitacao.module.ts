import { Module } from '@nestjs/common';
import { CorrecaoSolicitacaoService } from './correcao_solicitacao.service';
import { CorrecaoSolicitacaoController } from './correcao_solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';

@Module({
  controllers: [CorrecaoSolicitacaoController],
  providers: [CorrecaoSolicitacaoService, PrismaService, EmailService]
})
export class CorrecaoSolicitacaoModule {}
