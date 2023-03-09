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

    if (uf !== 'AP' && viagem.exterior === "NAO") {
        const meiaDiaria = this.valorServidoresForaAP(cargo, classe, viagem.servidor_acompanhando) / 2;
        const totalInterno =
          diarias * this.valorServidoresForaAP(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;
  
        console.log(
          'fora de macapa',
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalInterno),
        );
    }

    /*if (viagem.exterior === "SIM") {
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
    const cargoServidores  =  ["TCDAS 07", "TCDAS 06", "TCDAS 05", "TCDAS 04", "TCDAS 03", "AUDITOR"];
    const cargoComum       =  ["ASSISTENTE DE CONTROLE EXTERNO","TECNICO DE CONTROLE EXTERNO", "TCDAS 02", "TCDAS 01"];

    if (acompanha === "SIM" && cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 766.22;
    } else if (acompanha === "NAO" && cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 530.46;
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 648.34;
    }  

    if (cargoServidores.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 766.22;
    }      
    
    return 0;
  }


  valorServidoresForaAP(cargo: string, classe: string, acompanha: string): number {
    const cargoServidores  =  ["TCDAS 07", "TCDAS 06", "TCDAS 05", "TCDAS 04", "TCDAS 03", "AUDITOR"];
    const cargoComum       =  ["ASSISTENTE DE CONTROLE EXTERNO","TECNICO DE CONTROLE EXTERNO", "TCDAS 02", "TCDAS 01"];

    if (acompanha === "SIM" && cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 851.36;
    } else if (acompanha === "NAO" && cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 589.40;
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 720.38;
    }  

    if (cargoServidores.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 851.36;
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