import { Module } from '@nestjs/common';
import { ValorDiariasService } from './valor_diarias.service';
import { ValorDiariasController } from './valor_diarias.controller';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ValorDiariasController],
  providers: [ValorDiariasService, PrismaService]
})
export class ValorDiariasModule {}
