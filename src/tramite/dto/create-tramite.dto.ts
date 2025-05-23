import { log_tramite, solicitacao } from '@prisma/client';

export class CreateTramiteDto {
  cod_lotacao_origem: number; 
  lotacao_origem: string;
  cod_lotacao_destino: number; 
  lotacao_destino: string;
  status: string;
  datareg?: Date;
  solicitacao_id: number;
  solicitacao?: solicitacao;
  log_tramite?: log_tramite;
  flag_daof?: string;
}
