import { aeroporto, cidade, evento, valor_viagem } from "@prisma/client";

export class CreateViagemDto {

  /* origem?: aeroporto;
  destino?: aeroporto; */

  origem_id?: number;
  destino_id?: number;


  /* cidade_origem?: cidade;
  cidade_destino?: cidade; */

  cidade_origem_id: number;
  cidade_destino_id: number;

  exterior?: string;
  local_exterior: string;
  pais_id: number;

  data_ida: Date;
  data_volta: Date;
  justificativa?: string;

  viagem_diferente?: string;
  data_ida_diferente?: Date;
  data_volta_diferente?: Date;
  justificativa_diferente?: string;
  //valor_diaria?: number; //<======deve colocar obrigatório em produção

  datareg?: Date;
  arcar_passagem?: string;
  custos: string[];
  servidor_acompanhando?: string;
  viagem_superior?: string;
  viagem_pernoite?: string;
  justificativa_municipios?: string;
  valor_passagem?: number;
  valor_viagem?: valor_viagem[];

  solicitacao_id?: number;

  deslocamento?: string;
  //eventoId?: number; //transient
}
