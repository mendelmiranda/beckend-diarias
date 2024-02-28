import { Module } from '@nestjs/common';
import { SolicitacaoCondutoresService } from './solicitacao_condutores.service';
import { SolicitacaoCondutoresController } from './solicitacao_condutores.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [SolicitacaoCondutoresController],
  providers: [SolicitacaoCondutoresService, PrismaService]
})
export class SolicitacaoCondutoresModule {}
