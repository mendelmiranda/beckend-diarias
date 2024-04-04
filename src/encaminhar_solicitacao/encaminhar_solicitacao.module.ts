import { Module } from '@nestjs/common';
import { EncaminharSolicitacaoService } from './encaminhar_solicitacao.service';
import { EncaminharSolicitacaoController } from './encaminhar_solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [EncaminharSolicitacaoController],
  providers: [EncaminharSolicitacaoService, PrismaService]
})
export class EncaminharSolicitacaoModule {}
