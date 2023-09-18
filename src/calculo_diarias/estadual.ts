import { Util } from "src/util/Util";
import { Acompanha, Local } from "./diarias-enum";
import { valor_diarias, viagem } from '@prisma/client';
import { evento } from '@prisma/client';

export default class CalculoEstadual {


    servidores(viagem: viagem, uf: string, valorDiaria: valor_diarias, evento: evento): number {    
        const totalDias = Util.totalDeDias(evento.inicio, evento.fim)+2;
        const diarias = totalDias - 1;
    
        if (uf === 'AP' && viagem.viagem_pernoite === "SIM" || viagem.viagem_superior === "SIM") {
          const meiaDiaria = this.valorServidoresDentroAP(valorDiaria.dentro, viagem.servidor_acompanhando) / 2;
          return diarias * this.valorServidoresDentroAP(valorDiaria.dentro,  viagem.servidor_acompanhando) + meiaDiaria;
        }
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