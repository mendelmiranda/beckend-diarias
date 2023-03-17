import { Module } from '@nestjs/common';
import { CargoDiariasService } from './cargo_diarias.service';
import { CargoDiariasController } from './cargo_diarias.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [CargoDiariasController],
  providers: [CargoDiariasService, PrismaService]
})
export class CargoDiariasModule {}
