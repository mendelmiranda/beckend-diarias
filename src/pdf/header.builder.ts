import { Injectable } from '@nestjs/common';
import { Util } from 'src/util/Util';

interface HeaderBuilderData {
  solicitacao: any;
  base64Image: string;
}

@Injectable()
export class HeaderBuilder {
  build(data: HeaderBuilderData): any[] {
    const { solicitacao, base64Image } = data;
    const content = [];

    // Logo
    content.push({
      image: base64Image,
      width: 120,
    });

    // Cabeçalho
    content.push({
      text: "TRIBUNAL DE CONTAS DO ESTADO",
      style: "header",
    });

    content.push({
      text: "\n",
    });

    // Número da solicitação
    content.push({
      text: "\nSOLICITAÇÃO Nº " + solicitacao.id,
      style: "texto",
    });

    // Tabela de informações do responsável
    content.push({
      style: "titulosHeader",
      table: {
        widths: ['*', '*', '*'], // Larguras iguais, preenchendo toda a largura disponível
        headerRows: 1,
        body: [
          ["Responsável", "Lotação", "Data Solicitação"],
          [
            solicitacao.nome_responsavel,
            solicitacao.lotacao,
            Util.formataDataCurtaComHora(solicitacao.datareg ?? new Date()),
          ],
        ],
      },
      layout: 'noBorders',
      margin: [0, 10, 0, 10]
    });

    // Justificativa - Título
    content.push({
      text: "Justificativa",
      style: "titulosHeader",
      margin: [0, 10, 0, 5],
    });

    // Justificativa - Conteúdo - Use table para garantir largura total
    content.push({
      table: {
        widths: ['*'], // Utiliza toda a largura disponível
        body: [
          [{
            text: solicitacao.justificativa,
            fontSize: 11,
            alignment: 'justify' // Força a justificação do texto
          }]
        ]
      },
      layout: 'noBorders', // Sem bordas visíveis
      margin: [0, 0, 0, 5]
    });
    

    // Linha horizontal
    content.push({
      canvas: [
        {
          type: 'line',
          x1: 0, y1: 0,
          x2: 515, y2: 0, // Largura total da página A4 menos margens
          lineWidth: 1,
          lineColor: '#999999'
        }
      ],
      margin: [0, 0, 0, 10]
    });

    return content;
  }
}