// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { AprovacaoDefinitivaDaofService } from 'src/aprovacao_definitiva_daof/aprovacao_definitiva_daof.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { SolicitacaoCondutoresService } from 'src/solicitacao_condutores/solicitacao_condutores.service';
import { PdfGenerator } from './pdf-generator.service';
import { SolicitacaoPdfBuilder } from './solicitacao-pdf.builder';
import { AprovacaoDefinitiva } from '../aprovacao_definitiva/entities/aprovacao_definitiva.entity';
import { AprovacaoDefinitivaService } from 'src/aprovacao_definitiva/aprovacao_definitiva.service';


@Injectable()
export class PdfService {
  constructor(
    private solicitacaoService: SolicitacaoService,
    private solicitacaoCondutoresService: SolicitacaoCondutoresService,
    private aprovacaoDefinitivaDaofiService: AprovacaoDefinitivaDaofService,
    private aprovacaoDefinitivaService: AprovacaoDefinitivaService,
    private pdfGenerator: PdfGenerator,
    private solicitacaoPdfBuilder: SolicitacaoPdfBuilder,
  ) {}

  async generateSolicitacaoPdf(id: number): Promise<Buffer> {
    // Buscar todos os dados necessários
    const solicitacao = await this.pesquisaSolicitacaoPorId(id);
    if (!solicitacao) {
      throw new Error(`Solicitação com ID ${id} não encontrada`);
    }

    const condutores = await this.getCondutoresDaSolicitacao(id);
    const assinatura = await this.getAssinaturaDoDocumentoDAOF(id);
    const assinaturaPresidente = await this.getAssinaturaDefinitivaPresidencia(id);

    // Construir o documento PDF
    const docDefinition = this.solicitacaoPdfBuilder.build({
      solicitacao,
      condutores,
      assinatura,
      assinaturaPresidente,
    });

    // Gerar o PDF
    return this.pdfGenerator.generatePdf(docDefinition);
  }

  async pesquisaSolicitacaoPorId(id: number) {
    return await this.solicitacaoService.detalhesDaSolicitacao(id).catch((e) => {
      console.error(e);
      return null;
    });
  }

  getCondutoresDaSolicitacao(id: number) {
    return this.solicitacaoCondutoresService.findAll(id);
  }

  getAssinaturaDoDocumentoDAOF(solicitacaoId: number) {
    return this.aprovacaoDefinitivaDaofiService.findAssinaturaDiretorDAOF(
      solicitacaoId,
    );
  }

  getAssinaturaDefinitivaPresidencia(solicitacaoId: number) {
    return this.aprovacaoDefinitivaService.findAssinaturaPresidente(
      solicitacaoId,
    );
  }
}