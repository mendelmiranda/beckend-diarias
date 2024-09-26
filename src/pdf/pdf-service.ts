// pdf.service.ts
import { Injectable } from '@nestjs/common';
import * as PdfPrinter from 'pdfmake';
import * as fs from 'fs';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';

@Injectable()
export class PdfServiceGenerator {
  
    constructor( private solicitacaoService: SolicitacaoService) {}

    async pesquisaSolicitacaoPorId(id: number) {
        return await this.solicitacaoService.detalhesDaSolicitacao(id).catch((e) => {
            console.error(e);
            return null;
        }
        );
    }


    
  private printer = new PdfPrinter({
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
  });

  async generatePdf(docDefinition): Promise<Buffer> {
    const pdfDocGenerator = this.printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      pdfDocGenerator.on('data', (chunk) => chunks.push(chunk));
      pdfDocGenerator.on('end', () => {
        const result = Buffer.concat(chunks);
        resolve(result);
      });
      pdfDocGenerator.on('error', (err) => reject(err));
      pdfDocGenerator.end();
    });
  }
}
