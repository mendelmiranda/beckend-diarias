import { evento, participante } from '@prisma/client';

export class CreateEventoParticipanteDto {
  evento_id: number;
  participante_id: number;
}
