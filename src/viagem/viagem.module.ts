import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ViagemController],
  providers: [ViagemService, PrismaService],
})
export class ViagemModule {}
