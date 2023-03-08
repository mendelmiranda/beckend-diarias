import { viagem } from '@prisma/client';
import { Util } from 'src/util/Util';
import { CreateViagemDto } from './dto/create-viagem.dto';

export default class CalculoDiariaMembros {

  membros(viagem: viagem, uf: string, cargo: string) {
    const totalDias = Util.totalDeDias(viagem.data_ida, viagem.data_volta);
    const diarias = totalDias - 1;

    if (uf === 'AP') {
      const meiaDiaria = this.valorMembrosDentroAP(cargo) / 2;
      const totalInterno =
        diarias * this.valorMembrosDentroAP(cargo) + meiaDiaria;

      console.log(
        'interno',
        Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(totalInterno),
      );
    }

    if (uf !== 'AP' && viagem.exterior === "NAO") {
        const meiaDiaria = this.valorMembrosForaAP(cargo) / 2;
        const totalInterno =
          diarias * this.valorMembrosForaAP(cargo) + meiaDiaria;
  
        console.log(
          'fora de macapa',
          Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(totalInterno),
        );
    }

    if (viagem.exterior === "SIM") {
        const meiaDiaria = this.valorMembrosInternacional(cargo) / 2;
        const internacional =
          diarias * this.valorMembrosInternacional(cargo) + meiaDiaria;
  
        console.log(
          'fora de macapa',
          Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(internacional),
        );
    }

    return '';
  }

  valorMembrosDentroAP(cargo: string): number {
    if (
      cargo?.trim() === 'CONSELHEIRO' ||
      cargo?.trim() === 'PROCURADOR GERAL DE CONTAS'
    ) {
      return 1178.8;
    }

    if (
      cargo?.trim() === 'CONSELHEIRO-SUBSTITUTO' ||
      cargo?.trim() === 'PROCURADOR DE CONTAS'
    ) {
      return 1119.86;
    }
    return 0;
  }

  valorMembrosForaAP(cargo: string): number {
    if (
      cargo?.trim() === 'CONSELHEIRO' ||
      cargo?.trim() === 'PROCURADOR GERAL DE CONTAS'
    ) {
      return 1309.78;
    }

    if (
      cargo?.trim() === 'CONSELHEIRO-SUBSTITUTO' ||
      cargo?.trim() === 'PROCURADOR DE CONTAS'
    ) {
      return 1244.29;
    }
    return 0;
  }

  valorMembrosInternacional(cargo: string): number {
    if (
      cargo?.trim() === 'CONSELHEIRO' ||
      cargo?.trim() === 'PROCURADOR GERAL DE CONTAS'
    ) {
      return 727.00;
    }

    if (
      cargo?.trim() === 'CONSELHEIRO-SUBSTITUTO' ||
      cargo?.trim() === 'PROCURADOR DE CONTAS'
    ) {
      return 691.00;
    }
    return 0;
  }



}

/* export interface ServidoresCalculo {
    cargo?: string;
    viagem: CreateViagemDto;
}

    uf ap - 4
    mcp - 131

enum Membros {
    CONSELHEIROS = 1,
    PROCURADOR_GERAL_DE_CONTAS = 2,
    CONSELHEIRO_SUBSTITUTO = 3,
    PROCURADORES_DE_CONTAS = 4,
    SERVIDORES = 5
} */
