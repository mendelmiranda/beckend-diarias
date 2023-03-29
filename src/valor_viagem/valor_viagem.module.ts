import { Module } from '@nestjs/common';
import { ValorViagemService } from './valor_viagem.service';
import { ValorViagemController } from './valor_viagem.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ValorViagemController],
  providers: [ValorViagemService, PrismaService]
})
export class ValorViagemModule {}
