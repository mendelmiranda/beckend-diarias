import { evento, viagem_participantes } from "@prisma/client";

export class CreateEventoParticipanteDto {
  evento_id: number;
  participante_id: number;
  //evento: evento;
  
}
