import { Util } from "src/util/Util";
import { Acompanha, Local, Municipios, UF } from "./diarias-enum";
import { valor_diarias, viagem, evento } from '@prisma/client';

export default class CalculoInternacional {

    servidores(viagem: viagem, valorDiaria: valor_diarias, evento: evento, temPassagem: string): number { 

        return this.viagemInternacional(viagem, valorDiaria, evento);        
      }
  
      private viagemInternacional(viagem: viagem, valorDiaria: valor_diarias, evento: evento): number {
        const totalDias = Util.totalDeDias(evento.inicio, evento.fim)+2;
        const diarias = totalDias - 1;   
        
        if (viagem.exterior === "SIM") {
            return  (diarias-1) * this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando);            
        } 
        
        return 0;
      }

      valoresAdicionais(viagem: viagem, valorDiaria: valor_diarias){
        const valorNacional = this.valorNacional(viagem, valorDiaria);
        const meiaDiaria = this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando) / 2; 

        return (valorNacional+meiaDiaria);
      }
  
      private valorNacional(viagem: viagem, valorDiaria: valor_diarias): number {
        return  this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando); 
      }

      private valorServidoresInternacional(valorDiaria: number, acompanha: string): number {    
        if(acompanha === "SIM"){
          return this.valorAcompanhando(Local.INTERNACIONAL);
        }   
        return valorDiaria;
      }

      private valorServidoresForaAP(valorDiaria: number, acompanha: string): number {    
        if(acompanha === "SIM"){
          return this.valorAcompanhando(Local.FORA);
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