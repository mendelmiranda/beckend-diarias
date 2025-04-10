import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PdfServiceGenerator } from './pdf-service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { SolicitacaoCondutoresService } from 'src/solicitacao_condutores/solicitacao_condutores.service';
import { AprovacaoDefinitivaDaofService } from 'src/aprovacao_definitiva_daof/aprovacao_definitiva_daof.service';

@Module({
  controllers: [PdfController],
  providers: [PdfService, PdfServiceGenerator, SolicitacaoService, PrismaService, LogSistemaService, SolicitacaoCondutoresService, AprovacaoDefinitivaDaofService]
})
export class PdfModule {}
