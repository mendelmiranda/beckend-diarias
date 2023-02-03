import { Module } from '@nestjs/common';
import { BancosService } from './bancos.service';
import { BancosController } from './bancos.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [BancosController],
  providers: [BancosService, PrismaService],
})
export class BancosModule {}
