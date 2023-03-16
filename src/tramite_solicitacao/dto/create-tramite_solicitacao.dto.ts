export class CreateTramiteSolicitacaoDto {
  solicitacao_id: number;
  cod_lotacao: number; 
  lotacao: string;
  status: string;
  datareg?: Date;
}
