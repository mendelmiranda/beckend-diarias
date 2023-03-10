import { viagem } from '@prisma/client';
import { Util } from 'src/util/Util';
import { CreateViagemDto } from './dto/create-viagem.dto';

export default class CalculoDiariasServidores {
  cargoServidores  =  ["TCDAS 07", "TCDAS 06", "TCDAS 05", "TCDAS 04", "TCDAS 03", "AUDITOR"];
  cargoComum       =  ["ASSISTENTE DE CONTROLE EXTERNO","TECNICO DE CONTROLE EXTERNO", "TCDAS 02", "TCDAS 01"];

  servidores(viagem: viagem, uf: string, cargo: string, classe: string) {
    const totalDias = Util.totalDeDias(viagem.data_ida, viagem.data_volta);
    const diarias = totalDias - 1;


    if (uf === 'AP') {
      const meiaDiaria = this.valorServidoresDentroAP(cargo, classe, viagem.servidor_acompanhando) / 2;
      const totalInterno = diarias * this.valorServidoresDentroAP(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;

      if(viagem.viagem_superior === "SIM"){
        console.log('interno - superior a 6h', Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(meiaDiaria));  
      } else if (viagem.viagem_pernoite === "SIM"){
        const pernoite = this.valorServidoresDentroAP(cargo, classe, viagem.servidor_acompanhando);
        console.log('interno - pernoite', Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(pernoite));  
      }
      //verificar 
      console.log('interno', Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(totalInterno));
    }

    if (uf !== 'AP' && viagem.exterior === "NAO") {
        const meiaDiaria = this.valorServidoresForaAP(cargo, classe, viagem.servidor_acompanhando) / 2;
        const totalInterno = diarias * this.valorServidoresForaAP(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;
  
        console.log('fora de macapa', Intl.NumberFormat('pt-BR', {style: 'currency',currency: 'BRL',}).format(totalInterno),);
    }

    if (viagem.exterior === "SIM") {
        const meiaDiaria = this.valorServidoresInternacional(cargo, classe, viagem.servidor_acompanhando) / 2;
        const internacional =
          diarias * this.valorServidoresInternacional(cargo, classe, viagem.servidor_acompanhando) + meiaDiaria;
  
        console.log(
          'exterior',
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(internacional),
        );
    }

    return '';
  }

  valorServidoresDentroAP(cargo: string, classe: string, acompanha: string): number {    

    if (acompanha === "SIM" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 766.22;
    } else if (acompanha === "NAO" && this.cargoComum.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
      return 530.46;
    }

    if(cargo.trim() === "TECNICO DE CONTROLE EXTERNO"){
      return 648.34;
    }  

    if (this.cargoServidores.some(serv => cargo.trim().includes(serv.trim()) || classe.includes(serv.trim()))) {
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

