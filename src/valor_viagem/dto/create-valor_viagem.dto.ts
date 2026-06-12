export class CreateValorViagemDto {
  viagem_id: number;
  tipo?: string;
  destino?: string;
  valor_individual?: number;
  valor_grupo?: number;
  cotacao_dolar?: number;
  justificativa?: string;
  participante_id?: number;
}
