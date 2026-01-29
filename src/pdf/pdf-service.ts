// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { PDFDocument } from 'pdf-lib';
import { AprovacaoDefinitivaService } from 'src/aprovacao_definitiva/aprovacao_definitiva.service';
import { AprovacaoDefinitivaDaofService } from 'src/aprovacao_definitiva_daof/aprovacao_definitiva_daof.service';
import { SolicitacaoService } from 'src/solicitacao/solicitacao.service';
import { SolicitacaoCondutoresService } from 'src/solicitacao_condutores/solicitacao_condutores.service';
import { PdfGenerator } from './pdf-generator.service';
import { SolicitacaoPdfBuilder } from './solicitacao-pdf.builder';

import { readFile } from 'fs/promises';
import { join } from 'path';


@Injectable()
export class PdfService {
  constructor(
    private solicitacaoService: SolicitacaoService,
    private solicitacaoCondutoresService: SolicitacaoCondutoresService,
    private aprovacaoDefinitivaDaofiService: AprovacaoDefinitivaDaofService,
    private aprovacaoDefinitivaService: AprovacaoDefinitivaService,
    private pdfGenerator: PdfGenerator,
    private solicitacaoPdfBuilder: SolicitacaoPdfBuilder,
  ) { }

  /* async generateSolicitacaoPdf(id: number): Promise<Buffer> {
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
  } */

  async generateSolicitacaoPdf(id: number, comAnexo: boolean): Promise<Buffer> {
  const solicitacao = await this.pesquisaSolicitacaoPorId(id);
  if (!solicitacao) throw new Error(`Solicitação com ID ${id} não encontrada`);

  const condutores = await this.getCondutoresDaSolicitacao(id);
  const assinatura = await this.getAssinaturaDoDocumentoDAOF(id);
  const assinaturaPresidente = await this.getAssinaturaDefinitivaPresidencia(id);

  // ✅ LOGO LOCAL (sem TLS, sem fetch)
  const logoDataUrl = await this.fileToDataUrl('src/assets/logo-title.png');

  const docDefinition = this.solicitacaoPdfBuilder.build({
    solicitacao,
    condutores,
    assinatura,
    assinaturaPresidente,
  });

  (docDefinition as any).images = {
    ...((docDefinition as any).images ?? {}),
    logoTce: logoDataUrl,
  };

  const pdfmakeBytes = await this.pdfGenerator.generatePdf(docDefinition);
  const mainPDF = await PDFDocument.load(new Uint8Array(pdfmakeBytes));

  // anexos continuam iguais
  if (comAnexo) {
    const anexoUrls = solicitacao.eventos
      ?.flatMap(evento =>
        evento.anexo_evento?.map(
          anexo =>
            `https://arquivos.tce.ap.gov.br:3000/download/${anexo.api_anexo_id}`
        ) || []
      ) || [];

    for (const url of anexoUrls) {
      try {
        const response = await fetch(url);
        const anexoBuffer = await response.arrayBuffer();
        const anexoPDF = await PDFDocument.load(new Uint8Array(anexoBuffer));
        const pages = await mainPDF.copyPages(anexoPDF, anexoPDF.getPageIndices());
        pages.forEach(page => mainPDF.addPage(page));
      } catch (err) {
        console.error(`Erro ao anexar PDF de ${url}`, err);
      }
    }
  }

  const mergedPDFBytes = await mainPDF.save();
  return Buffer.from(mergedPDFBytes);
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

  async fileToDataUrl(relativePath: string): Promise<string> {
  // process.cwd() aponta para a raiz do projeto
  const filePath = join(process.cwd(), relativePath);

  const buffer = await readFile(filePath);

  // ajuste o mime se trocar o formato
  return `data:image/png;base64,${buffer.toString('base64')}`;
}

}