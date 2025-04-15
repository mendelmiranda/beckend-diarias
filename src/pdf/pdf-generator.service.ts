// pdf-generator.service.ts
import { Injectable } from '@nestjs/common';
const PdfPrinter = require('pdfmake');

@Injectable()
export class PdfGenerator {
  
  private printer = new PdfPrinter({
    Roboto: {
      normal: 'fonts/Roboto-Regular.ttf',
      bold: 'fonts/Roboto-Medium.ttf',
      italics: 'fonts/Roboto-Italic.ttf',
      bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    },
    GoogleSansText: {
      normal: 'fonts/OpenSans-Regular.ttf',
      bold: 'fonts/OpenSansText-Bold.ttf',
      italics: 'fonts/OpenSans-Italic.ttf',
      bolditalics: 'fonts/OpenSansText-BoldItalic.ttf'
    }
  });

  async generatePdf(docDefinition: any): Promise<Buffer> {
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