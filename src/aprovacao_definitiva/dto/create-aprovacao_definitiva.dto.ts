import { solicitacao } from "@prisma/client";

export class CreateAprovacaoDefinitivaDto {
    id?: number;
    
  /* solicitacao_id?: number;
  solicitacao?: solicitacao; */
  presidente_exercicio: string;
  datareg: Date
}
