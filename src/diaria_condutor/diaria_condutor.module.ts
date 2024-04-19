import { Module } from '@nestjs/common';
import { DiariaCondutorService } from './diaria_condutor.service';
import { DiariaCondutorController } from './diaria_condutor.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [DiariaCondutorController],
  providers: [DiariaCondutorService, PrismaService]
})
export class DiariaCondutorModule {}
