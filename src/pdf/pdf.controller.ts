// pdf.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf-service';
import { ApiOperation } from '@nestjs/swagger';


@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Get('/:id/com-anexo/:comAnexo')
  @ApiOperation({ summary: 'Gera o PDF da solicitação' })
  async getPdf(@Res() res: Response, @Param('id') id: number, @Param('comAnexo') comAnexo: string) {

    const comAnexoBool = comAnexo === 'SIM';


    try {
      const pdfBuffer = await this.pdfService.generateSolicitacaoPdf(+id, comAnexoBool);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Solicitacao.pdf"');
      res.send(pdfBuffer);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      res.status(500).send('Erro ao gerar PDF');
    }
  }
}