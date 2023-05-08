import { Module } from '@nestjs/common';
import { ValorDiariasService } from './valor_diarias.service';
import { ValorDiariasController } from './valor_diarias.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ValorDiariasController],  
  providers: [ValorDiariasService, PrismaService]
  
})
export class ValorDiariasModule {}
