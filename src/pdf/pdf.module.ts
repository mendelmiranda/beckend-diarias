import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PdfServiceGenerator } from './pdf-service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, PdfServiceGenerator]
})
export class PdfModule {}
