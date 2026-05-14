/** Linha de participante (por evento) no memorando */
export interface CiMemoriaParticipanteDetalhe {
  nome: string;
  matricula: string;
  cargoFuncao: string;
  classeReferencia: string;
  periodoViagemEnumerado: string;
  diariasContadasTexto: string;
  valorDiariaFmt: string;
  valorTotalDiariasFmt: string;
  bancoLinha: string;
  agenciaLinha: string;
  contaLinha: string;
}

export interface CiMemoriaEventoBloco {
  titulo: string;
  localTexto: string;
  periodoEventoTexto: string;
  participantes: CiMemoriaParticipanteDetalhe[];
}

/** Dados para o PDF do memorando (C.I.) — protocolo e-TCE + visão da solicitação */
export interface CiMemoriaPdfDados {
  /** Número exibido em "C.I. n." = Cod_TCE retornado pelo e-TCE */
  numeroProtocoloTce: string;
  dataDocumento: Date;
  para: string;
  assunto: string;
  textoCorpo1: string;
  textoCorpo2: string;
  eventos: CiMemoriaEventoBloco[];
  valorTotalDiarias: number;
  valorTotalPassagens: number;
  valorTotalCustos: number;
  valorTotalDiariasFmt: string;
  extensoDiarias: string;
  extensoPassagens: string;
  extensoCustos: string;
  sufixoLocalCustos: string;
  observacoesExtras?: string;
  nomeAssinatura: string;
  cargoAssinatura: string;
}
