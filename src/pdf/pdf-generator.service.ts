// pdf-generator.service.ts
import { Injectable } from '@nestjs/common';
const PdfPrinter = require('pdfmake');
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';


@Injectable()
export class PdfGenerator {

  constructor() {
    // Inicializa as fontes virtuais no pdfMake
    (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
  }
  
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

  /* async generatePdf(docDefinition: any): Promise<Buffer> {
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
  } */

    generatePdf(docDefinition: any): Promise<Buffer> {
      const pdfDoc = pdfMake.createPdf(docDefinition);
  
      return new Promise((resolve, reject) => {
        pdfDoc.getBuffer((buffer: Buffer) => {
          resolve(buffer);
        });
      });
    }
  
    // 🆕 Este é o método que faltava
    createPdfMakeDoc(docDefinition: any) {
      return pdfMake.createPdf(docDefinition);
    }
}