import { Module } from '@nestjs/common';
import { AssinaturaDaofService } from './assinatura_daof.service';
import { AssinaturaDaofController } from './assinatura_daof.controller';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';

@Module({
  controllers: [AssinaturaDaofController],
  providers: [AssinaturaDaofService, PrismaService, LogSistemaService]
})
export class AssinaturaDaofModule {}
