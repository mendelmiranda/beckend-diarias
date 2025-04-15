// builders/solicitacao-pdf.builder.ts
import { Injectable } from '@nestjs/common';
import { formataDataCurta, Util } from 'src/util/Util';
import { HeaderBuilder } from './header.builder';
import { EventosBuilder } from './eventos.builder';
import { CondutoresBuilder } from './condutores.builder';
import { PdfContent, PdfDocDefinition } from './pdf-content.model';
import { AssinaturaBuilder } from './assinatura.builder';
import { PresidenteAssinaturaBuilder } from './presidente-assinatura.builder';
import { ImagemLogo } from './imagem-logo';

@Injectable()
export class SolicitacaoPdfBuilder {
  constructor(
    private headerBuilder: HeaderBuilder,
    private eventosBuilder: EventosBuilder,
    private condutoresBuilder: CondutoresBuilder,
    private assinaturaBuilder: AssinaturaBuilder,
    private presidenteAssinaturaBuilder: PresidenteAssinaturaBuilder,
  ) {}

  // Imagem base64 do logo
  private base64Image: string = ImagemLogo.exibirImagem(); // Substitua pela sua imagem base64

    build(data: PdfContent): PdfDocDefinition {
      const { solicitacao, condutores, assinatura, assinaturaPresidente } = data;
      
      let content: any[] = [];
      
      // Adiciona o cabeçalho e informações básicas
      content = content.concat(this.headerBuilder.build({
        solicitacao,
        base64Image: this.base64Image
      }));
  
      // Adiciona seção de eventos
      if (solicitacao.eventos && solicitacao.eventos.length > 0) {
        content = content.concat(this.eventosBuilder.build({
          eventos: solicitacao.eventos,
        }));
      }
  
      // Adiciona seção de motoristas/condutores
      if (condutores && condutores.length > 0) {
        content = content.concat(this.condutoresBuilder.build({
          condutores,
        }));
      }
  
      // Adiciona assinatura DAOFI e empenhos
      content = content.concat(this.assinaturaBuilder.build({
        solicitacao,
        assinatura,
      }));
      
      // Adiciona assinatura do presidente (se existir)
      if (assinaturaPresidente) {
        content = content.concat(this.presidenteAssinaturaBuilder.build({
          solicitacao,
          assinaturaPresidente,
        }));
      }
  
      // Retorna o documento completo
      return {
        content,
        styles: this.getStyles(),
        pageMargins: [30, 30, 30, 30],
        pageSize: 'A4',
        pageOrientation: 'portrait',
      };
    }

  private getStyles() {
    return {
      header: {
        fontSize: 14,
        bold: true,
      },
      texto: {
        fontSize: 10,
        bold: true,
      },
      textoNormal: {
        fontSize: 10,
        bold: false,
        width: '100%'
      },
      titulosHeader: {
        fontSize: 11,
        bold: true,
      },
      justificativa: {
        fontSize: 10,
      },
      textoEmp: {
        fontSize: 10,
      },
      titulos: {
        fontSize: 11,
        bold: true,
      },
      subtitulos: {
        fontSize: 10,
        bold: true,
        italics: true,
      },
      textos: {
        fontSize: 10,
      },
      defaultStyle: {
        font: 'GoogleSansText'
      }
    };
  }
}

