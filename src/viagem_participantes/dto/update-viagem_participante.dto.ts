import { PartialType } from '@nestjs/mapped-types';
import { CreateViagemParticipanteDto } from './create-viagem_participante.dto';
import { evento_participantes, viagem } from '@prisma/client';

export class UpdateViagemParticipanteDto extends PartialType(
  CreateViagemParticipanteDto,
) {
  id: number;
  evento_participantes_id: number;
  evento_participantes: evento_participantes;

  viagem_id: number;
  viagem: viagem;
}
