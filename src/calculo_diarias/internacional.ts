import { Util } from "src/util/Util";
import { Acompanha, Local, Municipios, UF } from "./diarias-enum";
import { valor_diarias, viagem, evento } from '@prisma/client';

export default class CalculoInternacional {

    servidores(viagem: viagem, valorDiaria: valor_diarias, evento: evento, total: number): number { 
        return this.viagemInternacional(viagem, valorDiaria, evento, total);        
      }
  
      private viagemInternacional(viagem: viagem, valorDiaria: valor_diarias, evento: evento, total: number): number {
        //const totalDias = Util.totalDeDias(evento.inicio, evento.fim)+2;
        const diarias = total;   
        
        if (viagem.exterior === "SIM") {
            return  diarias * this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando);            
        }         
        return 0;
      }
      
      valorNacional(viagem: viagem, valorDiaria: valor_diarias): number {
        return  this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando); 
      }

      valorNacionalMeia(viagem: viagem, valorDiaria: valor_diarias){
        return this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando) / 2; 
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