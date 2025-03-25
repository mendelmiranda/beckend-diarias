export class CreateValorViagemDto {
  viagem_id: number;
  tipo?: string;
  destino?: string;
  valor_individual?: number;
  valor_grupo?: number;

  participante_id?: number;

}
