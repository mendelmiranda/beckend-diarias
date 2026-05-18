import { Injectable } from '@nestjs/common';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { PdfGenerator } from 'src/pdf/pdf-generator.service';
import type {
  CiMemoriaParticipanteDetalhe,
  CiMemoriaPdfDados,
} from './ci-memoria-pdf.types';

const AZUL_TCE = '#1a4d8c';

@Injectable()
export class CiMemoriaPdfBuilder {
  constructor(private readonly pdfGenerator: PdfGenerator) {}

  async buildBase64(dados: CiMemoriaPdfDados): Promise<string> {
    const logoPath = join(process.cwd(), 'src/assets/logo-title.png');
    const logoBuffer = await readFile(logoPath);
    const logoTce = `data:image/png;base64,${logoBuffer.toString('base64')}`;

    const dataDoc = format(dados.dataDocumento, 'dd/MM/yyyy', { locale: ptBR });

    const blocosEventos: unknown[] = [];
    for (const ev of dados.eventos) {
      blocosEventos.push(
        { text: ev.titulo.toUpperCase(), style: 'tituloEvento', margin: [0, 14, 0, 4] },
        {
          text: [
            { text: 'Local: ', bold: true },
            ev.localTexto,
            '   |   ',
            { text: 'Período do evento: ', bold: true },
            ev.periodoEventoTexto,
          ],
          margin: [0, 0, 0, 8],
        },
      );
      for (const p of ev.participantes) {
        blocosEventos.push(this.tabelaParticipante(p));
        blocosEventos.push({ text: ' ', margin: [0, 4, 0, 0] });
      }
    }

    const docDefinition = {
      pageMargins: [36, 36, 36, 48] as [number, number, number, number],
      defaultStyle: { font: 'Roboto', fontSize: 10, color: '#111' },
      images: { logoTce },
      content: [
        this.cabecalho(),
        { canvas: [{ type: 'line', x1: 0, y1: 0, x2: 523, y2: 0, lineWidth: 0.5, lineColor: '#999' }], margin: [0, 6, 0, 10] },
        this.tabelaMeta(dados, dataDoc),
        { text: '\n' },
        { text: 'À PRESIDÊNCIA,', bold: true, margin: [0, 0, 0, 8] },
        { text: dados.textoCorpo1, alignment: 'justify', margin: [0, 0, 0, 8] },
        { text: dados.textoCorpo2, alignment: 'justify', margin: [0, 0, 0, 12] },
        { text: 'EVENTOS E PARTICIPANTES', bold: true, fontSize: 11, margin: [0, 4, 0, 6] },
        ...blocosEventos,
        { text: '\n' },
        { text: 'CUSTOS TOTAIS APURADOS:', bold: true, italics: true, margin: [0, 8, 0, 6] },
        this.tabelaCustos(dados),
        ...(dados.observacoesExtras?.trim()
          ? [
              { text: '\n' },
              { text: 'Observações', bold: true, margin: [0, 6, 0, 4] },
              { text: dados.observacoesExtras.trim(), alignment: 'justify' },
            ]
          : []),
        { text: '\n\n' },
        { text: 'Respeitosamente,', margin: [0, 0, 0, 28] },
        {
          stack: [
            { text: '', bold: true, italics: true, alignment: 'center' },
            { text: dados.nomeAssinatura.toUpperCase(), alignment: 'center', margin: [0, 4, 0, 0] },
            { text: '', bold: true, alignment: 'center', margin: [0, 12, 0, 0] },
            { text: (dados.cargoAssinatura || '—').toUpperCase(), alignment: 'center' },
          ],
        },
      ],
      footer: (currentPage: number) => ({
        margin: [36, 0, 36, 12],
        columns: [
          { text: '', width: '*' },
          { text: String(currentPage), width: 20, alignment: 'right', color: AZUL_TCE, bold: true },
        ],
      }),
      styles: {
        cell: { margin: [4, 4, 4, 4] },
        tituloEvento: { fontSize: 11, bold: true, color: AZUL_TCE },
      },
    };

    const buffer = await this.pdfGenerator.generatePdf(docDefinition);
    return buffer.toString('base64');
  }

  private cabecalho() {
    return {
      columns: [
        { width: 200, stack: [{ image: 'logoTce', width: 190 }] },
        {
          width: '*',
          stack: [
            {
              text: 'SECRETARIA DE GESTÃO DE PESSOAS',
              alignment: 'right',
              color: AZUL_TCE,
              bold: true,
              fontSize: 10,
            },
          ],
        },
      ],
      columnGap: 12,
    };
  }

  private tabelaMeta(dados: CiMemoriaPdfDados, dataDoc: string) {
    return {
      table: {
        widths: ['*', '*'],
        body: [
          [
            { text: [{ text: 'DATA: ', bold: true }, dataDoc], style: 'cell', colSpan: 2 },
            {},
          ],
          [
            { text: [{ text: 'PARA: ', bold: true }, dados.para], colSpan: 2, style: 'cell' },
            {},
          ],
          [
            { text: [{ text: 'ASSUNTO: ', bold: true }, dados.assunto.toUpperCase()], colSpan: 2, style: 'cell' },
            {},
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#000',
        vLineColor: () => '#000',
      },
    };
  }

  private tabelaParticipante(dados: CiMemoriaParticipanteDetalhe) {
    return {
      table: {
        widths: ['*', '*', '*', '*'],
        body: [
          [
            {
              text: [{ text: 'PARTICIPANTE: ', bold: true }, dados.nome.toUpperCase()],
              fillColor: '#e8e8e8',
              style: 'cell',
              colSpan: 2,
            },
            {},
            {
              text: [{ text: 'MATRÍCULA: ', bold: true }, String(dados.matricula)],
              fillColor: '#e8e8e8',
              style: 'cell',
              colSpan: 2,
            },
            {},
          ],
          [
            { text: [{ text: 'CARGO/FUNÇÃO: ', bold: true }, dados.cargoFuncao || '—'], style: 'cell', colSpan: 2 },
            {},
            { text: [{ text: 'Classe/Referência: ', bold: true }, dados.classeReferencia || '—'], style: 'cell', colSpan: 2 },
            {},
          ],
          [
            { text: [{ text: 'PERÍODO: ', bold: true }, dados.periodoViagemEnumerado], style: 'cell' },
            { text: [{ text: 'DIÁRIAS CONTADAS: ', bold: true }, dados.diariasContadasTexto], style: 'cell' },
            { text: [{ text: 'VALOR/DIÁRIA: ', bold: true }, dados.valorDiariaFmt], style: 'cell' },
            { text: [{ text: 'VALOR TOTAL/DIÁRIAS: ', bold: true }, dados.valorTotalDiariasFmt], style: 'cell' },
          ],
          [
            { text: dados.bancoLinha, style: 'cell', colSpan: 2 },
            {},
            { text: dados.agenciaLinha, style: 'cell' },
            { text: dados.contaLinha, style: 'cell' },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#000',
        vLineColor: () => '#000',
      },
    };
  }

  private tabelaCustos(dados: CiMemoriaPdfDados) {
    return {
      table: {
        widths: ['*'],
        body: [
          [
            {
              text: `Valor total das diárias: ${dados.valorTotalDiariasFmt} (${dados.extensoDiarias})`,
              style: 'cell',
            },
          ],
          [
            {
              text: `Valor total das passagens aéreas: ${this.fmtBrl(dados.valorTotalPassagens)} (${dados.extensoPassagens}).`,
              style: 'cell',
            },
          ],
          [
            {
              text: `Valor total dos custos${dados.sufixoLocalCustos}: ${this.fmtBrl(dados.valorTotalCustos)} (${dados.extensoCustos}).`,
              style: 'cell',
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        hLineColor: () => '#000',
        vLineColor: () => '#000',
      },
    };
  }

  private fmtBrl(v: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  }
}
