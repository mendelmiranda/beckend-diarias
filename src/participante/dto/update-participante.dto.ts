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
  endereco?: string;
  estado_id?: number;
  cidade_id?: number;
  recebe_diarias_na_origem?: string;
  profissao?: string;
  local_trabalho?: string;
  contaDiariaModel?:    conta_diaria;
}
