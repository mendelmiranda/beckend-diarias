// builders/sections/header.builder.ts
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
      text: "TRIBUNAL DE CONTAS DO ESTADO DO AMAPÁ",
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
      layout: "noBorders",
      table: {
        body: [
          ["Responsável", "Lotação", "Data Solicitação"],
          [
            solicitacao.nome_responsavel,
            solicitacao.lotacao,
            Util.formataDataCurtaComHora(solicitacao.datareg ?? new Date()),
          ],
        ],
      },
    });

    content.push({ text: "\n\n" });

    // Justificativa
    content.push(
      {
        text: "Justificativa",
        style: "texto",
      },
      {
        text: solicitacao.justificativa ?? "\n\n",
        style: "textoNormal",
      }
    );

    return content;
  }
}