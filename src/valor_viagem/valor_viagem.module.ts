import { Module } from '@nestjs/common';
import { ValorViagemService } from './valor_viagem.service';
import { ValorViagemController } from './valor_viagem.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ValorViagemController],
  providers: [ValorViagemService, PrismaClient]
})
export class ValorViagemModule {}
