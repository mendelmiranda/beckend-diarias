import { viagem } from '@prisma/client';
import { Util } from 'src/util/Util';
import { CreateViagemDto } from './dto/create-viagem.dto';

export default class CalculoDiariasServidores {

  servidores(viagem: viagem, uf: string, cargo: string, classe: string) {
    const totalDias = Util.totalDeDias(viagem.data_ida, viagem.data_volta);
    const diarias = totalDias - 1;

    if (uf === 'AP') {
      const meiaDiaria = this.valorServidoresDentroAP(cargo, classe, viagem.servidor_acompanhando) / 2;
      const totalInterno = diarias * this.valorServidoresDentroAP(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;

      console.log('interno', Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(totalInterno));
    }

    /* if (uf !== 'AP' && viagem.exterior === "NAO") {
        const meiaDiaria = this.valorMembrosForaAP(cargo) / 2;
        const totalInterno =
          diarias * this.valorMembrosForaAP(cargo) + meiaDiaria;
  
        console.log(
          'fora de macapa',
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalInterno),
        );
    }

    if (viagem.exterior === "SIM") {
        const meiaDiaria = this.valorMembrosInternacional(cargo) / 2;
        const internacional =
          diarias * this.valorMembrosInternacional(cargo) + meiaDiaria;
  
        console.log(
          'exterior',
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(internacional),
        );
    } */

    return '';
  }

  valorServidoresDentroAP(cargo: string, classe: string, acompanha: string): number {
    //tcds estão na classe

    console.log('cargo', cargo);
    console.log('classe', classe);  
    

    const cargoServidores  =  ["TCDAS 07", "TCDAS 06", "TCDAS 05", "TCDAS 04", "TCDAS 03", "AUDITOR"];
    const cargoComum       =  ["ASSISTENTE DE CONTROLE EXTERNO","TECNICO DE CONTROLE EXTERNO", "TCDAS 02", "TCDAS 01"];


    //contains analista ou auditor (quando estiverem acompanhando, não recebem nada)
    //só recebe valor acompanhando conselheiro: Técnico de controle externo, Assistente de Controle Externo, TCDAS 02 e TCDAS 01.

    /* if(cargoComum.find(carg => carg === cargo.trim())){
      if(acompanha === "SIM"){
        return 766.22;
      } else {
        return 648.34
      }
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 648.34;
    } */  

    cargoServidores.forEach(serv => {
      return cargo.includes(serv.trim()) || classe.includes(serv.trim()) ?  766.22 : 0;
    })
    

    /* if(cargoServidores.includes(cargo.trim()) || cargoServidores.includes(classe.trim())){
      return 766.22
    } */
    
    

    return 0;
  }



















  valorMembrosForaAP(cargo: string): number {
    if (
      cargo?.trim() === 'CONSELHEIRO' ||
      cargo?.trim() === 'PROCURADOR GERAL DE CONTAS'
    ) {
      return 1309.78;
    }

    if (
      cargo?.trim() === 'CONSELHEIRO-SUBSTITUTO' ||
      cargo?.trim() === 'PROCURADOR DE CONTAS'
    ) {
      return 1244.29;
    }
    return 0;
  }

  valorMembrosInternacional(cargo: string): number {
    if (
      cargo?.trim() === 'CONSELHEIRO' ||
      cargo?.trim() === 'PROCURADOR GERAL DE CONTAS'
    ) {
      return 727.00;
    }

    if (
      cargo?.trim() === 'CONSELHEIRO-SUBSTITUTO' ||
      cargo?.trim() === 'PROCURADOR DE CONTAS'
    ) {
      return 691.00;
    }
    return 0;
  }



}

/* export interface ServidoresCalculo {
    cargo?: string;
    viagem: CreateViagemDto;
}

    uf ap - 4
    mcp - 131

enum Membros {
    CONSELHEIROS = 1,
    PROCURADOR_GERAL_DE_CONTAS = 2,
    CONSELHEIRO_SUBSTITUTO = 3,
    PROCURADORES_DE_CONTAS = 4,
    SERVIDORES = 5
} */
