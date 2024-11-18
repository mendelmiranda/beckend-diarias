export class CreateViagemParticipanteDto {
  evento_participantes_id: number;  
  viagem_id: number;
  datareg: Date;
  servidor_acompanhando?: string;
  viagem_diferente?: string
  justificativa_diferente?: string;
  data_ida_diferente?: Date;
  data_volta_diferente?: Date;
  arcar_passagem?: string;
  custos?: string[];
  justificativa_custos?: string;
}
