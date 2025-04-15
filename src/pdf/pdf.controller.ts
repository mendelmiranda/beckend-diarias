// pdf.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf-service';


@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Get('/:id')
  async getPdf(@Res() res: Response, @Param('id') id: number) {
    try {
      const pdfBuffer = await this.pdfService.generateSolicitacaoPdf(+id);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Solicitacao.pdf"');
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      res.status(500).send('Erro ao gerar PDF');
    }
  }
}