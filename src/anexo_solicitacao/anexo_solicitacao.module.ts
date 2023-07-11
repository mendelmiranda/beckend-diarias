import { Module } from '@nestjs/common';
import { AnexoSolicitacaoService } from './anexo_solicitacao.service';
import { AnexoSolicitacaoController } from './anexo_solicitacao.controller';

@Module({
  controllers: [AnexoSolicitacaoController],
  providers: [AnexoSolicitacaoService]
})
export class AnexoSolicitacaoModule {}
