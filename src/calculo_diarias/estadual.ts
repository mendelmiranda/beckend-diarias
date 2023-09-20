import { Util } from "src/util/Util";
import { Acompanha, Local, Municipios, UF } from "./diarias-enum";
import { valor_diarias, viagem, evento } from '@prisma/client';


export default class CalculoEstadual {

    servidores(viagem: viagem, uf: string, cidade: string, valorDiaria: valor_diarias, evento: evento): number { 

      return this.viagemOutrosMunicipios(viagem, uf, cidade, valorDiaria, evento ) ||
             this.viagemSuperiorSeisHoras(viagem, uf, cidade, valorDiaria) ||
             this.viagemComPernoite(viagem, uf, cidade, valorDiaria)        
    }

    private viagemOutrosMunicipios(viagem: viagem, uf: string, cidade: string, valorDiaria: valor_diarias, evento: evento): number {
      
      if (uf === UF.AP && 
          cidade !== Municipios.MACAPA && 
          cidade !== Municipios.SANTANA && 
          cidade !== Municipios.MAZAGAO) {        
        
        const totalDias = Util.totalDeDias(evento.inicio, evento.fim);
        const diarias = totalDias - 1;

        const meiaDiaria = this.valorServidoresDentroAP(valorDiaria.dentro, viagem.servidor_acompanhando) / 2;
        
        return diarias * this.valorServidoresDentroAP(valorDiaria.dentro,  viagem.servidor_acompanhando) + meiaDiaria;
      }
      return 0;
    }

    private viagemSuperiorSeisHoras(viagem: viagem, uf: string, cidade: string,valorDiaria: valor_diarias): number {
      /*if (uf === UF.AP && viagem.viagem_superior === "SIM" && cidade !== Municipios.MACAPA) {
        return this.valorServidoresDentroAP(valorDiaria.dentro, viagem.servidor_acompanhando) / 2;         
      }*/
      return 0;
    }

    private viagemComPernoite(viagem: viagem, uf: string, cidade: string,valorDiaria: valor_diarias): number {
      /*if(uf === UF.AP && viagem.viagem_pernoite === "SIM" && cidade !== Municipios.MACAPA){
        return this.valorServidoresDentroAP(valorDiaria.dentro,  viagem.servidor_acompanhando);
      }*/
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