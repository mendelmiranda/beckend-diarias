import { Module } from '@nestjs/common';
import { LogTramiteService } from './log_tramite.service';
import { LogTramiteController } from './log_tramite.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [LogTramiteController],
  providers: [LogTramiteService, PrismaService]
})
export class LogTramiteModule {}
