import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { LogSistemaModule } from 'src/log_sistema/log_sistema.module';
import { PrismaService } from '../../prisma/prisma.service';
import { ValorDiariasController } from './valor_diarias.controller';
import { ValorDiariasService } from './valor_diarias.service';

@Module({
  imports: [HttpModule, LogSistemaModule],
  controllers: [ValorDiariasController],  
  providers: [ValorDiariasService, PrismaService]
  
})
export class ValorDiariasModule {}
