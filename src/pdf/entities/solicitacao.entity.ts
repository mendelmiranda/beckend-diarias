import { formataDataCurta } from "src/util/Util";

// entities/solicitacao.entity.ts
export class Solicitacao {
    id: number;
    nome_responsavel: string;
    lotacao: string;
    datareg: Date;
    justificativa: string;
    eventos: Evento[];
  
    getTotalValoresEventos(): number {
      return this.eventos.reduce((total, evento) => {
        return total + (evento.valor_evento || 0) + (evento.valor_total_inscricao || 0);
      }, 0);
    }
  }
  
  // entities/evento.entity.ts
  export class Evento {
    id: number;
    titulo: string;
    tipo_evento: { descricao: string };
    inicio: Date;
    fim: Date;
    informacoes: string;
    valor_evento?: number;
    valor_total_inscricao?: number;
  
    getFormattedPeriod(): string {
      return `${formataDataCurta(this.inicio)} a ${formataDataCurta(this.fim)}`;
    }
  }