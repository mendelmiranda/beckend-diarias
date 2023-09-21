import { evento } from '@prisma/client';

export class CreateEventosJuntoDto {
  evento_id: number;
  solicitacao_id: number;
  data_inicial: Date;
  data_final: Date;
}
