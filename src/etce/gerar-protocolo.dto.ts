export interface ArquivoProtocolo {
  Arquivo: string; // base64 sem prefixo data:
  NomeArquivo: string;
  NomeTipoDocumento: string;
  CodTipoDocumento: number;
}

export interface DadosProtocolo {
  cod_tipo_entrada: number;
  num_oficio: string;
  data_oficio: string; // ISO 8601: 2026-03-05T12:57:33.000Z
  cod_ug: number;
  sigiloso: boolean;
  cod_grupo: number;
  prioritario: boolean;
  observacoes: string;
  eletronico: boolean;
  assunto: string;
  numero_ouvidoria: string | null;
  cod_tipo_meia_entrega: number;
}

export interface Interessado {
  tipo_pessoa: string;
  cpf: string;
  nome: string;
  cod_tipo_interessado: number;
  cod_tipo_qualificacao: number;
  representante_legal_advogado: boolean;
}

export interface GerarProtocoloRequest {
  Arquivos: ArquivoProtocolo[];
  AnoPR: number;
  CodArea: number;
  CodTipoProcesso: number;
  CodTipoDocumento: number;
  CodTipoGrupoProtocolo: number;
  Protocolo: DadosProtocolo;
  Interessados: Interessado[];
}

export interface GerarProtocoloResponse {
  Cod_TCE: string;
}

/** Corpo para anexar documentos a protocolo já gerado no e-TCE (pós-`gerar`). */
export interface AnexarArquivosProtocoloRequest {
  Cod_TCE: string;
  Arquivos: ArquivoProtocolo[];
}