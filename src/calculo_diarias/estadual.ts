import { evento, valor_diarias, viagem } from '@prisma/client';
import { Acompanha, Local, Municipios, UF } from "./diarias-enum";


export default class CalculoEstadual {

    servidores(viagem: viagem, uf: string, cidade: string, valorDiaria: valor_diarias, evento: evento, total: number): number { 

      return this.viagemOutrosMunicipios(viagem, uf, cidade, valorDiaria, evento, total ) ||
             this.viagemSuperiorSeisHoras(viagem, uf, cidade, valorDiaria, total) ||
             this.viagemComPernoite(viagem, uf, cidade, valorDiaria)        
    }

    private viagemOutrosMunicipios(viagem: viagem, uf: string, cidade: string, valorDiaria: valor_diarias, evento: evento, total: number): number {
      
      if (uf === UF.AP && 
          cidade !== Municipios.MACAPA && 
          cidade !== Municipios.SANTANA && 
          cidade !== Municipios.MAZAGAO) {        
        
        const diarias = total//+1;        

        const meiaDiaria = this.valorServidoresDentroAP(valorDiaria.dentro, viagem.servidor_acompanhando) / 2;
        
        return diarias * this.valorServidoresDentroAP(valorDiaria.dentro,  viagem.servidor_acompanhando) + meiaDiaria;
      }
      return 0;
    }

    private viagemSuperiorSeisHoras(viagem: viagem, uf: string, cidade: string,valorDiaria: valor_diarias, total: number): number {
      if (uf === UF.AP && viagem.viagem_superior === "SIM" && cidade !== Municipios.MACAPA) {
        const meiaDiaria = this.valorServidoresDentroAP(valorDiaria.dentro, viagem.servidor_acompanhando) / 2;

        const resultado = total+1;

        return meiaDiaria * resultado;         
      }
      return 0;
    }

    private viagemComPernoite(viagem: viagem, uf: string, cidade: string,valorDiaria: valor_diarias): number {
      if(uf === UF.AP && viagem.viagem_pernoite === "SIM" && cidade !== Municipios.MACAPA){
        return this.valorServidoresDentroAP(valorDiaria.dentro,  viagem.servidor_acompanhando);
      }
      return 0;
    }

    private valorServidoresDentroAP(valorDiaria: number, acompanha: string): number {    
        if(acompanha === "SIM"){
          return this.valorAcompanhando( Local.DENTRO);
        }   
        return valorDiaria;
    }

    private valorAcompanhando(local: Local): number {
        switch (local) {
          case Local.DENTRO:
            return Acompanha.DENTRO;
          case Local.FORA:
            return Acompanha.FORA;
          case Local.INTERNACIONAL:
            return Acompanha.INTERNACIONAL;
          default:
            return 0;
        }
    }

    

}