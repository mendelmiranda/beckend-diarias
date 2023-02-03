import { Module } from '@nestjs/common';
import { ContaDiariaService } from './conta_diaria.service';
import { ContaDiariaController } from './conta_diaria.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ContaDiariaController],
  providers: [ContaDiariaService, PrismaService],
})
export class ContaDiariaModule {}
