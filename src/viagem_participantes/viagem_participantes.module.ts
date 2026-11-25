import { PrismaService } from 'prisma/prisma.service';
import { Module } from '@nestjs/common';
import { ViagemModule } from 'src/viagem/viagem.module';
import { ViagemParticipantesService } from './viagem_participantes.service';
import { ViagemParticipantesController } from './viagem_participantes.controller';

@Module({
  imports: [ViagemModule],
  controllers: [ViagemParticipantesController],
  providers: [ViagemParticipantesService, PrismaService],
})
export class ViagemParticipantesModule {}
