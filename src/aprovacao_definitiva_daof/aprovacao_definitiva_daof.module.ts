import { Module } from '@nestjs/common';
import { AprovacaoDefinitivaDaofService } from './aprovacao_definitiva_daof.service';
import { AprovacaoDefinitivaDaofController } from './aprovacao_definitiva_daof.controller';

@Module({
  controllers: [AprovacaoDefinitivaDaofController],
  providers: [AprovacaoDefinitivaDaofService]
})
export class AprovacaoDefinitivaDaofModule {}
