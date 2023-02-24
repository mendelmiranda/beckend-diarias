import { Module } from '@nestjs/common';
import { AeroportoService } from './aeroporto.service';
import { AeroportoController } from './aeroporto.controller';

@Module({
  controllers: [AeroportoController],
  providers: [AeroportoService]
})
export class AeroportoModule {}
