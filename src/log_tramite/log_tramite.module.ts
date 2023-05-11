import { Module } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { LogTramiteController } from './log_tramite.controller';
import { LogTramiteService } from './log_tramite.service';

@Module({
  controllers: [LogTramiteController],
  providers: [LogTramiteService, PrismaService]
})
export class LogTramiteModule {}
