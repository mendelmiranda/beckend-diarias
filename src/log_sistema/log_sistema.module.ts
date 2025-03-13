import { Module } from '@nestjs/common';
import { LogSistemaService } from './log_sistema.service';
import { LogSistemaController } from './log_sistema.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [LogSistemaController],
    providers: [LogSistemaService, PrismaService],
    exports: [LogSistemaService]
})
export class LogSistemaModule {}
