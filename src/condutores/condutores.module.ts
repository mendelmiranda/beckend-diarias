import { Module } from '@nestjs/common';
import { CondutoresService } from './condutores.service';
import { CondutoresController } from './condutores.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CondutoresController],
  providers: [CondutoresService, PrismaService]
})
export class CondutoresModule {}
