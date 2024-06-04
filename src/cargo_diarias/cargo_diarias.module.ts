import { Module } from '@nestjs/common';
import { CargoDiariasService } from './cargo_diarias.service';
import { CargoDiariasController } from './cargo_diarias.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';

@Module({
  controllers: [CargoDiariasController],
  providers: [CargoDiariasService, PrismaService, LogSistemaService]
})
export class CargoDiariasModule {}
