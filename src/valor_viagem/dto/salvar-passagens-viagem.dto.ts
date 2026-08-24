export class ItemPassagemDto {
  participante_id?: number | null;
  valor_individual: number;
}

export class SalvarPassagensViagemDto {
  destino?: string;
  justificativa?: string;
  modo: 'T' | 'I';
  valores: ItemPassagemDto[];
}
