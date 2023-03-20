import { viagem } from '@prisma/client';
import { Util } from 'src/util/Util';

export default class CalculoDiariasServidores {
  cargoServidores  =  ["TCDAS 07", "TCDAS 06", "TCDAS 05", "TCDAS 04", "TCDAS 03", "AUDITOR, ANALISTA DE CONT EXT"];
  cargoComum       =  ["ASSISTENTE DE CONTROLE EXTERNO","TECNICO DE CONTROLE EXTERNO", "TCDAS 02", "TCDAS 01"];

  servidores(viagem: viagem, uf: string, cargo: string, classe: string): number {
    const totalDias = Util.totalDeDias(viagem.data_ida, viagem.data_volta);
    const diarias = totalDias - 1;


    if (uf === 'AP') {
      const meiaDiaria = this.valorServidoresDentroAP(cargo, viagem.servidor_acompanhando) / 2;
      const totalInterno = diarias * this.valorServidoresDentroAP(cargo,  viagem.servidor_acompanhando) + meiaDiaria;

      if(viagem.viagem_superior === "SIM"){
        return meiaDiaria;
      } else if (viagem.viagem_pernoite === "SIM"){
        const pernoite = diarias * this.valorServidoresDentroAP(cargo,  viagem.servidor_acompanhando);
        return pernoite;
      }
      return totalInterno;
    }

    if (uf !== 'AP' && viagem.exterior === "NAO") {
        const meiaDiaria = this.valorServidoresForaAP(cargo, classe, viagem.servidor_acompanhando) / 2;
        const totalInterno = diarias * this.valorServidoresForaAP(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;

        return totalInterno;
    }

    if (viagem.exterior === "SIM") {
        const meiaDiaria = this.valorServidoresInternacional(cargo, classe, viagem.servidor_acompanhando) / 2;
        const internacional = diarias * this.valorServidoresInternacional(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;
  
        return internacional;
    }

    return 0;
  }

  valorServidoresDentroAP(cargo: string, acompanha: string): number {    

    if (acompanha === "SIM" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) )) {
      return 766.22;
    } else if (acompanha === "NAO" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) )) {
      return 530.46;
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 648.34;
    }      

    if (this.cargoServidores.some(serv => cargo.trim().includes(serv.trim()) )) {
      return 766.22;
    }      
    
    return 0;
  }


  valorServidoresForaAP(cargo: string, classe: string, acompanha: string): number {

    if (acompanha === "SIM" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 851.36;
    } else if (acompanha === "NAO" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 589.40;
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 720.38;
    }  

    if (this.cargoServidores.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 851.36;
    }
      
    
    return 0;
  }

  valorServidoresInternacional(cargo: string, classe: string, acompanha: string): number {

    if (acompanha === "SIM" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 472.55;
    } else if (acompanha === "NAO" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 327.00;
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 400;
    }  

    if (this.cargoServidores.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 472.55;
    }
    return 0;
  }

}

