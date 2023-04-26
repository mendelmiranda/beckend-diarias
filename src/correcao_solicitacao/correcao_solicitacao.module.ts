import { Module } from '@nestjs/common';
import { CorrecaoSolicitacaoService } from './correcao_solicitacao.service';
import { CorrecaoSolicitacaoController } from './correcao_solicitacao.controller';

@Module({
  controllers: [CorrecaoSolicitacaoController],
  providers: [CorrecaoSolicitacaoService]
})
export class CorrecaoSolicitacaoModule {}
