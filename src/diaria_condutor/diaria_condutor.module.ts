import { Module } from '@nestjs/common';
import { DiariaCondutorService } from './diaria_condutor.service';
import { DiariaCondutorController } from './diaria_condutor.controller';

@Module({
  controllers: [DiariaCondutorController],
  providers: [DiariaCondutorService]
})
export class DiariaCondutorModule {}
