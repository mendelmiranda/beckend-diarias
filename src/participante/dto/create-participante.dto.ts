export class CreateParticipanteDto {
  nome: string;
  cpf: string;
  tipo: string;
  data_nascimento: Date;
  matricula?: number;
  lotacao?: string;
  endereco?: string;
  estatdo_id?: number;
  cidade_id?: number;
  recebe_diarias_na_origem?: string;
  profissao?: string;
  local_trabalho?: string;
}
