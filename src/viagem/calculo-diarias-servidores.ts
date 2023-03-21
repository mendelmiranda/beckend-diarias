import { valor_diarias } from '@prisma/client';
import { viagem } from '@prisma/client';
import { Util } from 'src/util/Util';

export default class CalculoDiariasServidores {

  servidores(viagem: viagem, uf: string, valorDiaria: valor_diarias): number {
    const totalDias = Util.totalDeDias(viagem.data_ida, viagem.data_volta);
    const diarias = totalDias - 1;

    if (uf === 'AP') {
      const meiaDiaria = this.valorServidoresDentroAP(valorDiaria.dentro, viagem.servidor_acompanhando) / 2;
      return diarias * this.valorServidoresDentroAP(valorDiaria.dentro,  viagem.servidor_acompanhando) + meiaDiaria;
    }

    if (uf !== 'AP' && viagem.exterior === "NAO") {
        const meiaDiaria = this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando) / 2;
        return diarias * this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando) + meiaDiaria;
    }

    if (viagem.exterior === "SIM") {
        const meiaDiaria = this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando) / 2;
        return diarias * this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando) + meiaDiaria;
    } 

    return 0;
  }

  valorServidoresDentroAP(valorDiaria: number, acompanha: string): number {    
    if(acompanha === "SIM"){
      return this.valorAcompanhando("SIM", Local.DENTRO);
    }
   
    return valorDiaria;
  }

  valorServidoresForaAP(valorDiaria: number, acompanha: string): number {    
    if(acompanha === "SIM"){
      return this.valorAcompanhando("SIM", Local.FORA);
    }
   
    return valorDiaria;
  }

  valorServidoresInternacional(valorDiaria: number, acompanha: string): number {    
    if(acompanha === "SIM"){
      return this.valorAcompanhando("SIM", Local.INTERNACIONAL);
    }
   
    return valorDiaria;
  }

  valorAcompanhando(acompanha: string, local: string): number {

    if (acompanha === "SIM" && local === Local.DENTRO ) {
      return Acompanha.DENTRO;
    } 

    if (acompanha === "SIM" && local === Local.FORA ) {
      return Acompanha.FORA;
    } 

    if (acompanha === "SIM" && local === Local.INTERNACIONAL ) {
      return Acompanha.INTERNACIONAL;
    } 

    return 0;
  }

}


enum Acompanha {
  DENTRO = 766.22,
  FORA = 851.36,
  INTERNACIONAL = 472.55,
} 

enum Local {
  DENTRO = 'dentro',
  FORA = 'fora',
  INTERNACIONAL = 'internacional',
}