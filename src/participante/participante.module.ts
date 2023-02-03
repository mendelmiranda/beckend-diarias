import { Module } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { ParticipanteController } from './participante.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [ParticipanteController],
  providers: [ParticipanteService, PrismaService],
})
export class ParticipanteModule {}
