import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PdfServiceGenerator } from './pdf-service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, PdfServiceGenerator, SolicitacaoService, PrismaService, LogSistemaService]
})
export class PdfModule {}
