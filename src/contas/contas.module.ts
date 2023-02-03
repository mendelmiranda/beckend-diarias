import { Module } from '@nestjs/common';
import { ContasService } from './contas.service';
import { ContasController } from './contas.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ContasController],
  providers: [ContasService, PrismaService],
})
export class ContasModule {}
