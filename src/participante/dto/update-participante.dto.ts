import { PartialType } from '@nestjs/mapped-types';
import { conta_diaria } from '@prisma/client';
import { CreateParticipanteDto } from './create-participante.dto';

export class UpdateParticipanteDto extends PartialType(CreateParticipanteDto) {
  id: number;
  nome: string;
  cpf: string;
  tipo: string;
  data_nascimento: Date;
  matricula?: number;
  lotacao?: string;
  cep?: string;
  endereco?: string;
  estado_id?: number;
  recebe_diarias_na_origem: string;
  //contaDiariaModel?: conta_diaria;
}
