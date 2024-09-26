// pdf.controller.ts
import { Controller, Get, Res } from '@nestjs/common';

import { Response } from 'express';
import { PdfServiceGenerator } from './pdf-service';


@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfServiceGenerator) {}

  @Get()
  async getPdf(@Res() res: Response) {
    
    const docDefinition = {
      content: [
        'This is an example text for the PDF.'
      ],
    };

    try {
      const pdfBuffer = await this.pdfService.generatePdf(docDefinition);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Diaria.pdf"');

      res.send(pdfBuffer);
    } catch (err) {
      console.log(err);
      
      res.status(500).send('Error generating PDF');
    }
  }
}
