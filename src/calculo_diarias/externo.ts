import { Util } from 'src/util/Util';
import { Acompanha, Local, Municipios, UF } from './diarias-enum';
import { valor_diarias, viagem, evento } from '@prisma/client';

export default class CalculoNacional {
  servidores(viagem: viagem, uf: string, valorDiaria: valor_diarias, evento: evento, temPassagem: string, total: number): number {       
    return this.viagemNacional(viagem, uf, valorDiaria, evento, temPassagem, total);
  }

  private viagemNacional(viagem: viagem, uf: string, valorDiaria: valor_diarias, evento: evento, temPassagem: string, total: number): number {
    const diarias = total;

    /* if(this.verificaDeslocamentoEMesmoLocal(viagem, evento)){
      if (uf !== UF.AP && viagem.exterior === 'NAO' && temPassagem === 'SIM') {
        return diarias * this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando);
      } 
      
    } else { */
      if (uf !== UF.AP && viagem.exterior === 'NAO' && temPassagem === 'SIM') {
        const meiaDiaria =  this.valorNacionalMeia(viagem, valorDiaria);      
        return diarias * this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando) + meiaDiaria;
      }
    //}

    

    return 0;
  }

  verificaDeslocamentoEMesmoLocal(viagem: viagem, evento: evento): boolean{
    if(evento.cidade_id === viagem.cidade_destino_id || viagem.deslocamento === "SIM"){
      return true;
    }
    return false;
  }

  valorNacional(viagem: viagem, uf: string, valorDiaria: valor_diarias): number {
    return this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando);
  }

  valorNacionalMeia(viagem: viagem, valorDiaria: valor_diarias): number {
    return this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando) / 2;
  }

  private valorServidoresForaAP(valorDiaria: number, acompanha: string): number {
    if (acompanha === 'SIM') {
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
