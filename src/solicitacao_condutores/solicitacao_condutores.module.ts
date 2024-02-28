import { Module } from '@nestjs/common';
import { SolicitacaoCondutoresService } from './solicitacao_condutores.service';
import { SolicitacaoCondutoresController } from './solicitacao_condutores.controller';

@Module({
  controllers: [SolicitacaoCondutoresController],
  providers: [SolicitacaoCondutoresService]
})
export class SolicitacaoCondutoresModule {}
