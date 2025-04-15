// builders/sections/presidente-assinatura.builder.ts
import { Injectable } from '@nestjs/common';
import { Util } from 'src/util/Util';

interface PresidenteAssinaturaBuilderData {
  solicitacao: any;
  assinaturaPresidente: any;
}

@Injectable()
export class PresidenteAssinaturaBuilder {
  build(data: PresidenteAssinaturaBuilderData): any[] {
    const { solicitacao, assinaturaPresidente } = data;
    const content = [];

    // Espaçamento antes da assinatura
    content.push({ text: "\n" });

    // Formatação da assinatura
    const assinaturaTexto = this.formatarAssinatura(assinaturaPresidente);

    // Adiciona assinatura em formato de tabela
    content.push({
      style: "justificativa",
      table: {
        headerRows: 1,
        widths: ['*'],
        body: [
          [{
            text: 'ASSINATURA PRESIDÊNCIA',
            style: 'justificativa',
            bold: true
          }],
          [{
            text: assinaturaTexto,
            style: 'justificativa'
          }]
        ]
      }
    });

    return content;
  }

  private formatarAssinatura(assinaturaPresidente: any): string {
    if (!assinaturaPresidente?.assinatura?.presidente_exercicio) {
      return 'Aguardando assinatura do documento.';
    }
    
    return 'Assinado por: ' + 
           assinaturaPresidente.assinatura.presidente_exercicio + 
           ' em ' + 
           Util.formataDataNovas(assinaturaPresidente.datareg) + 
           ' as ' + 
           assinaturaPresidente.hora;
  }
}