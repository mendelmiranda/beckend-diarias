import { Module } from '@nestjs/common';
import { PortariaSolicitacaoService } from './portaria_solicitacao.service';
import { PortariaSolicitacaoController } from './portaria_solicitacao.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [PortariaSolicitacaoController],
  providers: [PortariaSolicitacaoService, PrismaService]
})
export class PortariaSolicitacaoModule {}
