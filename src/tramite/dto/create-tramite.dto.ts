import { solicitacao } from '@prisma/client';

export class CreateTramiteDto {
  cod_lotacao_origem: number; 
  lotacao_origem: string;
  cod_lotacao_destino: number; 
  lotacao_destino: string;
  status: string;
  datareg?: Date;
  solicitacao_id: number;
  solicitacao?: solicitacao;
}
