import { solicitacao } from '@prisma/client';

export class CreateTramiteDto {
  cod_lotacao: number; 
  lotacao: string;
  status: string;
  datareg?: Date;
  solicitacao_id: number;
  solicitacao?: solicitacao;
}
