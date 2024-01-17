export class CreateEmpenhoDaofiDto {
datareg: Date;
  tipo: string;
  saldo_inicial: number;
  valor_reservado: number;
  valor_pos_reserva?: number;
  solicitacao_id: number;
  acao?: string;
  observacao?: string;
}


