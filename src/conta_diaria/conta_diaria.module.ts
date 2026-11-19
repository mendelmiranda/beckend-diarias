import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaModule } from 'src/log_sistema/log_sistema.module';
import { ContaDiariaController } from './conta_diaria.controller';
import { ContaDiariaService } from './conta_diaria.service';

@Module({
  imports: [LogSistemaModule],
  controllers: [ContaDiariaController],
  providers: [ContaDiariaService, PrismaService],
  exports: [ContaDiariaService],
})
export class ContaDiariaModule {}
