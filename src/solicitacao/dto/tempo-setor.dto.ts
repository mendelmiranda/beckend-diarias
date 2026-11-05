export interface TempoSetorConsultaDto {
  numeros?: number[] | string;
}

export interface TempoSetorLinha {
  solicitacao_id: number;
  ordem: number;
  lotacao_origem: string | null;
  cod_lotacao: number;
  lotacao: string | null;
  status: string | null;
  entrada: string | null;
  tempo: string;
  dias: number;
  em_andamento: boolean;
}

export interface TempoSetorAusente {
  solicitacao_id: number;
  existe_solicitacao: boolean;
}

export interface TempoSetorResultado {
  itens: TempoSetorLinha[];
  sem_tramite: TempoSetorAusente[];
}
