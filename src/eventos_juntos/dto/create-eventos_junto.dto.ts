import { evento } from '@prisma/client';

export class CreateEventosJuntoDto {
  evento: evento;
  evento_id: number;
  data_inicial: Date;
  data_final: Date;
}
