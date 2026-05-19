// models/pdf-content.model.ts
export interface PdfContent {
  solicitacao: any;
  condutores: any[];
  assinatura: any;
  assinaturaPresidente?: any; // Adicionando assinatura do presidente
  /** Nomes de diretores DAOFI com ativo = SIM (id desc), para o rodapé da seção DISPONIBILIDADE */
  diretoresDaofiAtivos?: string[];
}

export interface PdfDocDefinition {
  content: any[];
  styles: Record<string, any>;
  pageMargins?: number[];
  pageSize?: string;
  pageOrientation?: string;
}