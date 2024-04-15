import { Module } from '@nestjs/common';
import { AssinaturaDaradService } from './assinatura_darad.service';
import { AssinaturaDaradController } from './assinatura_darad.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AssinaturaDaradController],
  providers: [AssinaturaDaradService, PrismaService]
})
export class AssinaturaDaradModule {}
