import { conta_diaria } from '@prisma/client';

export class CreateParticipanteDto {
  nome: string;
  cpf: string;
  tipo: string;
  data_nascimento: Date;
  matricula?: number;
  lotacao?: string;
  cargo?: string;
  classe?: string;
  endereco?: string;
  estado_id?: number;
  cidade_id?: number;
  recebe_diarias_na_origem?: string;
  profissao?: string;
  local_trabalho?: string;
  contaDiariaModel?: conta_diaria;
  funcao?: string;
  efetivo?: string;
  unificado?: string;
}
