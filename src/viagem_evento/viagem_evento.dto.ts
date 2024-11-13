import { viagem } from '@prisma/client';


export class CreateViagemEventoDto {

    evento_id: number;
    solicitacao_id: number;
    viagem_id: number;

}