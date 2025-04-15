// models/pdf-content.model.ts
export interface PdfContent {
  solicitacao: any;
  condutores: any[];
  assinatura: any;
  assinaturaPresidente?: any; // Adicionando assinatura do presidente
}

export interface PdfDocDefinition {
  content: any[];
  styles: Record<string, any>;
}