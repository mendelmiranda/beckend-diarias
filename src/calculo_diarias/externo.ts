import { Util } from 'src/util/Util';
import { Acompanha, Local, Municipios, UF } from './diarias-enum';
import { valor_diarias, viagem, evento } from '@prisma/client';

export default class CalculoNacional {
  servidores(viagem: viagem, uf: string, valorDiaria: valor_diarias, evento: evento, temPassagem: string): number {
    let mesmoDestino = false;
    if (viagem.origem_id === viagem.destino_id) {
      mesmoDestino = true;
    }
    return this.viagemNacional(viagem, uf, valorDiaria, evento, temPassagem, mesmoDestino);
  }

  private viagemNacional(viagem: viagem, uf: string, valorDiaria: valor_diarias, evento: evento, temPassagem: string, mesmoDestino?: boolean): number {
    const totalDias = Util.totalDeDias(evento.inicio, evento.fim);
    const diarias = totalDias - 1;

    if (uf !== UF.AP && viagem.exterior === 'NAO' && temPassagem === 'SIM') {
      let meiaDiaria = 0;

      if(!mesmoDestino){
        meiaDiaria = this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando) / 2;
      } else {
        meiaDiaria = this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando);
      }
      
      return diarias * this.valorServidoresForaAP(valorDiaria.fora, viagem.servidor_acompanhando) + meiaDiaria;
    }

    return 0;
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
