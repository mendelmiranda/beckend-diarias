import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteController } from './tramite.controller';
import { TramiteService } from './tramite.service';
import { LogTramiteService } from 'src/log_tramite/log_tramite.service';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';


@Module({
  controllers: [TramiteController],
  providers: [TramiteService, PrismaService, LogTramiteService, EmailService],
  imports: [EmailModule]
})
export class TramiteModule {}
