// pdf.service.ts

import { Injectable } from '@nestjs/common';
const PdfPrinter = require('pdfmake');
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { SolicitacaoCondutoresService } from 'src/solicitacao_condutores/solicitacao_condutores.service';

@Injectable()
export class PdfServiceGenerator {
  
    constructor( private solicitacaoService: SolicitacaoService, private readonly solicitacaoCondutoresService: SolicitacaoCondutoresService) {}

    async pesquisaSolicitacaoPorId(id: number) {
        return await this.solicitacaoService.detalhesDaSolicitacao(id).catch((e) => {
            console.error(e);
            return null;
        }
        );
    }

    getCondutoresDaSolicitacao( id: number) {
      return this.solicitacaoCondutoresService.findAll(id);
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
    const chunks: Uint8Array[] = [];

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
