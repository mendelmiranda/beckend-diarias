import { evento, solicitacao, viagem } from "@prisma/client";

export class CreateViagemEventoDto {

  evento_id: number;
 // evento: {connect: {id: number}};
  
  solicitacao_id: never;//number;
  //solicitacao: { connect: { id: number } }; 

  viagem_id: number;
  //viagem: {connect: {id: number}};

  datareg: Date;
}
