import { Module } from '@nestjs/common';
import { TramiteSolicitacaoService } from './tramite_solicitacao.service';
import { TramiteSolicitacaoController } from './tramite_solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [TramiteSolicitacaoController],
  providers: [TramiteSolicitacaoService, PrismaService]
})
export class TramiteSolicitacaoModule {}
