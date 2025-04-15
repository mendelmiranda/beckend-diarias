import { Module } from '@nestjs/common';

import { PdfController } from './pdf.controller';

import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { SolicitacaoCondutoresService } from 'src/solicitacao_condutores/solicitacao_condutores.service';
import { AprovacaoDefinitivaDaofService } from 'src/aprovacao_definitiva_daof/aprovacao_definitiva_daof.service';
import { PdfService } from './pdf-service';
import { PdfGenerator } from './pdf-generator.service';
import { SolicitacaoPdfBuilder } from './solicitacao-pdf.builder';
import { HeaderBuilder } from './header.builder';
import { EventosBuilder } from './eventos.builder';
import { CondutoresBuilder } from './condutores.builder';
import { AssinaturaBuilder } from './assinatura.builder';
import { AprovacaoDefinitivaService } from 'src/aprovacao_definitiva/aprovacao_definitiva.service';
import { PresidenteAssinaturaBuilder } from './presidente-assinatura.builder';

@Module({
  controllers: [PdfController],
  providers: [PdfGenerator, SolicitacaoPdfBuilder, 
    HeaderBuilder,
    EventosBuilder,
    CondutoresBuilder,
    AssinaturaBuilder,
    PresidenteAssinaturaBuilder,
    AprovacaoDefinitivaService,
    PdfService, SolicitacaoService, PrismaService, LogSistemaService, SolicitacaoCondutoresService, AprovacaoDefinitivaDaofService]
})
export class PdfModule {}
