/**
 * Filtros da tela de solicitações finalizadas (status PDF_GERADO).
 * As datas aceitam `yyyy-MM-dd` ou ISO completo; a comparação é feita por dia (UTC).
 */
export class PesquisaSolicitacoesFinalizadasDto {
  /** Data de registro da solicitação — início do intervalo. */
  dataregInicio?: string;

  /** Data de registro da solicitação — fim do intervalo. */
  dataregFim?: string;

  /** Período do evento — início do intervalo (evento que intersecte o período). */
  eventoInicio?: string;

  /** Período do evento — fim do intervalo (evento que intersecte o período). */
  eventoFim?: string;

  /** Nome (ou parte) do participante de algum evento da solicitação. */
  participante?: string;

  /** Nome (ou parte) do responsável pela solicitação. */
  solicitante?: string;

  /** Status pesquisado. Padrão: PDF_GERADO. */
  status?: string;

  /** Página (1-based). Padrão: 1. */
  pagina?: number;

  /** Registros por página. Padrão: 20, máximo: 100. */
  limite?: number;
}

export default PesquisaSolicitacoesFinalizadasDto;
