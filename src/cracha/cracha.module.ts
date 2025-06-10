import { Module } from '@nestjs/common';
import { CrachaService } from './cracha.service';
import { CrachaController } from './cracha.controller';


@Module({
  controllers: [CrachaController],
  providers: [CrachaService]
})
export class CrachaModule {}
