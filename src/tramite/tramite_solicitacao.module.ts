import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteSolicitacaoService } from './tramite_solicitacao.service';
import { TramiteSolicitacaoController } from './tramite_solicitacao.controller';

@Module({
  controllers: [TramiteSolicitacaoController],
  providers: [TramiteSolicitacaoService, PrismaService],
})
export class TramiteSolicitacaoModule {}
