import { Module } from '@nestjs/common';
import { AssinaturaService } from './assinatura.service';
import { AssinaturaController } from './assinatura.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AssinaturaController],
  providers: [AssinaturaService, PrismaService]
})
export class AssinaturaModule {}
