import { PrismaService } from 'prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ViagemParticipantesService } from './viagem_participantes.service';
import { ViagemParticipantesController } from './viagem_participantes.controller';

@Module({
  controllers: [ViagemParticipantesController],
  providers: [ViagemParticipantesService, PrismaService],
})
export class ViagemParticipantesModule {}
