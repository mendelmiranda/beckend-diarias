import { valor_diarias } from '@prisma/client';
import { viagem } from '@prisma/client';
import { Util } from 'src/util/Util';

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
        const diariaInteiraNacional =  this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando)
        return diarias * this.valorServidoresInternacional(valorDiaria.internacional, viagem.servidor_acompanhando) + meiaDiaria + diariaInteiraNacional;
    } 
    return 0;
  }

  private valorServidoresDentroAP(valorDiaria: number, acompanha: string): number {    
    if(acompanha === "SIM"){
      return this.valorAcompanhando( Local.DENTRO);
    }   
    return valorDiaria;
  }

  private valorServidoresForaAP(valorDiaria: number, acompanha: string): number {    
    if(acompanha === "SIM"){
      return this.valorAcompanhando(Local.FORA);
    }   
    return valorDiaria;
  }

  private valorServidoresInternacional(valorDiaria: number, acompanha: string): number {    
    if(acompanha === "SIM"){
      return this.valorAcompanhando(Local.INTERNACIONAL);
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