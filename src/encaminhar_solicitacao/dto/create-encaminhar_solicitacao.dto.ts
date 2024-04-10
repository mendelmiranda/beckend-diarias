
export class CreateEncaminharSolicitacaoDto {
  solicitacao_id: number;
  //solicitacao?: solicitacao;
  datareg: Date;
  usuario: string;
  justificativa: string;
  cod_lotacao_origem: number;
  lotacao_origem: string;
  cod_lotacao_destino: number;
  lotacao_destino: string;
  lido: string;

}
