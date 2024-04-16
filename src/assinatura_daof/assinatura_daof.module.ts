import { Module } from '@nestjs/common';
import { AssinaturaDaofService } from './assinatura_daof.service';
import { AssinaturaDaofController } from './assinatura_daof.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AssinaturaDaofController],
  providers: [AssinaturaDaofService, PrismaService]
})
export class AssinaturaDaofModule {}
