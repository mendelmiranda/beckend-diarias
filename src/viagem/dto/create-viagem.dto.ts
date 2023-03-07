export class CreateViagemDto {
  /* origem_id: number;
    destino_id: number;
    trecho: string;
    data_ida: Date;
    data_volta?: Date;
    datareg: Date;
    justificativa?: string; */

  origem_id: number;
  destino_id: number;
  exterior: string;
  local_exterior: string;
  pais_id: number;

  data_ida: Date;
  data_volta: Date;
  justificativa?: string;

  viagem_diferente?: string;
  data_ida_diferente?: Date;
  data_volta_diferente?: Date;
  justificativa_diferente?: string;

  datareg?: Date;
  arcar_passagem?: string;
  custos: string[];
}
