/**
 * Filtros e paginação da lista de solicitações empenhadas (DAOFI / anteriores).
 */
export class PesquisaSolicitacoesEmpenhadasDto {
  /** Página (1-based). Padrão: 1. */
  pagina?: number;

  /** Registros por página. Padrão: 10, máximo: 100. */
  limite?: number;

  /** Número (ou trecho) do ID da solicitação. */
  numero?: string;

  /** Nome (ou parte) do responsável pela solicitação. */
  solicitante?: string;
}

export default PesquisaSolicitacoesEmpenhadasDto;
