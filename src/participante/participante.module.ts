import { Module } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { ParticipanteController } from './participante.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ParticipanteController],
  providers: [ParticipanteService, PrismaClient],
})
export class ParticipanteModule {}
