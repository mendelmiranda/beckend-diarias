import { Module } from '@nestjs/common';
import { AssinaturaDaofService } from './assinatura_daof.service';
import { AssinaturaDaofController } from './assinatura_daof.controller';

@Module({
  controllers: [AssinaturaDaofController],
  providers: [AssinaturaDaofService]
})
export class AssinaturaDaofModule {}
