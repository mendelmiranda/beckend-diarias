export class CreateSolicitacaoDto {
  datareg: Date;
  justificativa: string;
  status: string;
  cpf_responsavel?: string;
  nome_responsavel?: string;
  cod_lotacao?: number;
  lotacao?: string;
  login?: string;
}
