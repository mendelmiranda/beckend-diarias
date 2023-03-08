import { viagem } from "@prisma/client";
import { CreateViagemDto } from './dto/create-viagem.dto';

export default class CalculoDiaria {

    //verificar se é internacional

    membros(viagem: viagem | never, uf: string, cargo: string){

        //uf ap - 4
        //mcp - 131
        if(uf === "AP"){
            console.log('dentro de macapá');    
            console.log('cargo', cargo);
                    
        }


        if(uf !== "AP"){
            console.log('fora de macapá');            
        }


        /* if(servidor.cargo?.trim() === "CONSELHEIRO" || servidor.cargo?.trim() === "PROCURADOR GERAL DE CONTAS"){
            return "1178.80";
        }

        if(servidor.cargo?.trim() === "CONSELHEIRO-SUBSTITUTO" || servidor.cargo?.trim() === "PROCURADOR DE CONTAS"){
            return "1119.86";
        } */

        
        return ""
    }

   
}

/* export interface ServidoresCalculo {
    cargo?: string;
    viagem: CreateViagemDto;
}

enum Membros {
    CONSELHEIROS = 1,
    PROCURADOR_GERAL_DE_CONTAS = 2,
    CONSELHEIRO_SUBSTITUTO = 3,
    PROCURADORES_DE_CONTAS = 4,
    SERVIDORES = 5
} */