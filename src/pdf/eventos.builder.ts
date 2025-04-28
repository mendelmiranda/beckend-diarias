import { Injectable } from '@nestjs/common';
import { formataDataCurta, Util } from 'src/util/Util';
import { conta_diaria } from '@prisma/client';

interface EventosBuilderData {
  eventos: any[];
}

interface ViagemKey {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  viagemDiferente: string;
  dataIdaDiferente?: string;
  dataVoltaDiferente?: string;
}

interface AgrupamentoViagem {
  viagem: any;
  participantes: any[];
}

@Injectable()
export class EventosBuilder {

  build(data: EventosBuilderData): any[] {
    const { eventos } = data;
    const content = [];
    let totalValoresEventos = 0;

    eventos.forEach((evento) => {
      const matchingEventos = eventos.filter((e) => e.id === evento.id) ?? [];

      // Título do evento
      content.push({
        text: "\n\n" + evento.titulo.toUpperCase(),
        style: "texto",
      });

      // Detalhes do evento
      content.push(
        {
          text: evento.tipo_evento?.descricao,
          style: "subtitulos",
        },
        {
          text: "De " + formataDataCurta(evento.inicio as Date) + " a " + formataDataCurta(evento.fim as Date) + "\n\n",
          style: "textoNormal",
        },
        {
          text: evento.informacoes,
          fontSize: 11,
        }
      );

      // Local do evento
      matchingEventos.forEach((data) => {
        let text: string;

        if (data.exterior === "SIM") {
          const paisNome = data.pais?.nome_pt ?? "";
          const localExterior = data.local_exterior ?? "";
          text = `${paisNome} - ${localExterior}`;
        } else {
          const cidadeDescricao = data.cidade?.descricao ?? "";
          const estadoUf = data.cidade?.estado?.uf ?? "";
          text = `${cidadeDescricao}/${estadoUf}`;
        }

        content.push({
          text: "Local do Evento: " + text,
          style: "textoNormal",
        });
      });

      // Valores do evento
      eventos.filter((a) => a.id === evento.id).forEach((data) => {
        if (data.valor_evento || data.valor_total_inscricao) {
          totalValoresEventos += (data.valor_total_inscricao!) + (data.valor_evento!);

          content.push({ text: "\n" });

          content.push({
            style: "justificativa",
            table: {
              headerRows: 1,
              widths: ['*'],
              body: [
                [
                  {
                    text: 'VALORES DO EVENTO',
                    style: 'justificativa',
                  }
                ],
                ['Valor unitário: ' + Util.formataValorDiaria(data.valor_evento!, "NACIONAL") +
                  '\n' + 'Valor total: ' + Util.formataValorDiaria(data.valor_total_inscricao!, "NACIONAL") +
                  '\n' + "Observação: " + data.observacao_valor]
              ]
            }
          });
        } else {
          content.push({
            text: "Observação: " + data.observacao_valor === null ? "" : data.observacao_valor,
          });
        }

        // Título para as seções de participantes
        content.push({
          text: "\n\nPARTICIPANTES DO EVENTO\n\n",
          style: "texto",
          //pageBreak: 'before' // Inicia em uma nova página para melhor visualização
        });

        // TABELA 1: Participantes com diárias/valores (utilizando nosso novo método)
        const tabelasDiarias = this.buildParticipantesDiariasTable(evento.evento_participantes);
        if (Array.isArray(tabelasDiarias)) {
          tabelasDiarias.forEach(item => content.push(item));
        } else {
          content.push(tabelasDiarias);
        }

        // TABELA 2: Participantes com viagens (utilizando nosso novo método)
        content.push({
          text: "\nVIAGENS DOS PARTICIPANTES\n",
          style: "texto",
          pageBreak: 'before' // Inicia em uma nova página para melhor visualização
        });

        const tabelasViagens = this.buildParticipantesViagensTable(evento.evento_participantes);
        if (Array.isArray(tabelasViagens)) {
          tabelasViagens.forEach(item => content.push(item));
        } else {
          content.push(tabelasViagens);
        }
      });
    });

    return content;
  }

  // NOVA FUNÇÃO: Criar tabela apenas com participantes e diárias/valores
  private buildParticipantesDiariasTable(participantes: any[]): any {
    if (!participantes || participantes.length === 0) {
      return { text: "Nenhum participante encontrado", style: "textoNormal" };
    }

    // Dividir as informações em duas tabelas separadas para melhor visualização

    // Tabela 1A: Informações pessoais do participante
    const headerRowPessoal = [
      { text: 'Nome', style: 'tableHeader', bold: true },
      { text: 'CPF', style: 'tableHeader', bold: true },
      { text: 'Cargo', style: 'tableHeader', bold: true },
      { text: 'Lotação', style: 'tableHeader', bold: true }
    ];

    const tableBodyPessoal = [headerRowPessoal];

    // Tabela 1B: Informações financeiras do participante
    const headerRowFinanceiro = [
      { text: 'Nome', style: 'tableHeader', bold: true },
      { text: 'Valor Diária', style: 'tableHeader', bold: true },
      { text: 'Banco', style: 'tableHeader', bold: true },
      { text: 'Agência', style: 'tableHeader', bold: true },
      { text: 'Conta', style: 'tableHeader', bold: true }
    ];

    const tableBodyFinanceiro = [headerRowFinanceiro];

    // Preenchemos ambas as tabelas com os dados dos participantes
    participantes.forEach(ep => {
      // Busca a conta ativa ou a primeira conta
      const conta = ep.participante.conta_diaria?.find((a) => a.ativa === true) || ep.participante.conta_diaria?.[0];

      // Calcula valor total de diárias para o participante
      let valorDiaria = 0;
      let diariasDesc = "";

      // Verificamos todas as viagens do participante para calcular o valor total das diárias
      if (ep.viagem_participantes && ep.viagem_participantes.length > 0) {
        ep.viagem_participantes.forEach(vp => {
          if (vp.viagem.valor_viagem) {
            vp.viagem.valor_viagem
              .filter(v => v.participante_id === ep.participante.id && v.tipo === "DIARIA")
              .forEach(diaria => {
                valorDiaria += diaria.valor_individual ?? 0;

                if (diaria.justificativa !== undefined && diaria.justificativa?.length > 0) {
                  diariasDesc += Util.formataValorDiaria(diaria.valor_individual ?? 0, "NACIONAL") +
                    " (Justificativa: " + diaria.justificativa + ")\n";
                } else {
                  diariasDesc += Util.formataValorDiaria(diaria.valor_individual ?? 0, "NACIONAL") + "\n";
                }
              });
          }
        });
      }

      // Adicionamos os dados às respectivas tabelas
      tableBodyPessoal.push([
        ep.participante.nome || "",
        Util.formataMascaraCpf(ep.participante.cpf) || "",
        ep.participante.cargo || "",
        ep.participante.lotacao || ""
      ]);

      tableBodyFinanceiro.push([
        ep.participante.nome || "", // Repetimos o nome para identificação
        diariasDesc || "Sem diárias",
        conta?.banco?.banco || "",
        conta?.agencia || "",
        conta?.conta || ""
      ]);
    });

    // Retornamos as duas tabelas em sequência
    return [
      {
        text: "Dados Pessoais dos Participantes",
        style: "texto",
        margin: [0, 5, 0, 5]
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: tableBodyPessoal
        },
        layout: 'lightHorizontalLines',
        style: 'textoNormal',
        margin: [0, 0, 0, 10]
      },
      {
        text: "Dados Financeiros dos Participantes",
        style: "texto",
        margin: [0, 10, 0, 5]
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto', 'auto', 'auto'],
          body: tableBodyFinanceiro
        },
        layout: 'lightHorizontalLines',
        style: 'textoNormal',
      }
    ];
  }

  // NOVA FUNÇÃO: Criar tabela apenas com participantes e informações de viagens
  private buildParticipantesViagensTable(participantes: any[]): any {
    if (!participantes || participantes.length === 0) {
      return { text: "Nenhum participante encontrado", style: "textoNormal" };
    }

    // Agrupamos as viagens semelhantes
    const viagensAgrupadas = this.agruparViagens(participantes);

    if (viagensAgrupadas.length === 0) {
      return { text: "Nenhuma viagem encontrada", style: "textoNormal" };
    }

    // Para cada grupo de viagens, criamos uma tabela
    const content = [];

    viagensAgrupadas.forEach((agrupamento, index) => {
      const viagem = agrupamento.viagem;
      const participantesViagem = agrupamento.participantes;

      // Formata destino e origem
      const local = viagem.cidade_destino?.descricao + " - " + viagem.cidade_destino?.estado?.uf;
      const cidadeDestino = viagem?.destino?.cidade === undefined ? local :
        viagem?.destino?.cidade + " - " + viagem?.destino?.uf;

      let origem = "";
      if (viagem.evento?.tem_passagem === "NAO") {
        origem = viagem.cidade_origem?.descricao + " - " + viagem.cidade_origem?.estado?.uf;
      } else {
        origem = viagem.origem?.cidade + " - " + viagem.origem?.uf;
      }

      // Título e detalhes da viagem em um bloco mais compacto
      content.push({
        text: `\nViagem ${index + 1}: ${origem} → ${cidadeDestino}`,
        style: "texto",
        margin: [0, 10, 0, 5]
      });

      // Tabela com detalhes da viagem para economizar espaço
      const viagemDetalhes = [
        ['Ida', viagem.data_ida ? formataDataCurta(viagem.data_ida as Date) : "Não especificada"],
        ['Volta', viagem.deslocamento === "SIM" ? "Com deslocamento" :
          (viagem.data_volta ? formataDataCurta(viagem.data_volta as Date) : "Não especificada")]
      ];

      // Adicionar linhas adicionais apenas se necessário
      if (viagem.viagem_diferente === "SIM") {
        viagemDetalhes.push(['Ida diferente', formataDataCurta(viagem.data_ida_diferente as Date)]);
        viagemDetalhes.push(['Volta diferente', formataDataCurta(viagem.data_volta_diferente as Date)]);
        viagemDetalhes.push(['Justificativa', viagem.justificativa_diferente]);
      }

      // Tabela de detalhes da viagem
      content.push({
        table: {
          widths: ['auto', '*'],
          body: viagemDetalhes
        },
        style: 'textoNormal',
        layout: 'noBorders',
        margin: [0, 0, 0, 10]
      });

      // Tabela de participantes com colunas reduzidas
      const headerRow = [
        { text: 'Nome', style: 'tableHeader', bold: true },
        { text: 'CPF', style: 'tableHeader', bold: true },
        { text: 'Cargo', style: 'tableHeader', bold: true },
        { text: 'Observações', style: 'tableHeader', bold: true }
      ];

      const tableBody = [headerRow];

      // Para cada participante, adicionamos uma linha com informações reduzidas
      participantesViagem.forEach(p => {
        // Observações específicas para este participante nesta viagem
        let observacoes = [];

        if (viagem.viagem_pernoite === "SIM") observacoes.push("Com pernoite");
        if (viagem.viagem_superior === "SIM") observacoes.push("Viagem >6h");
        if (viagem.servidor_acompanhando === "SIM") observacoes.push("Com servidor");
        

        const vp = p.viagem_participante; // pega o objeto da viagem_participante

        if (vp?.data_ida_diferente) {
          observacoes.push("Ida diferente: " + formataDataCurta(new Date(vp.data_ida_diferente)));
        }

        if (vp?.data_volta_diferente) {
          observacoes.push("Volta diferente: " + formataDataCurta(new Date(vp.data_volta_diferente)));
        }

        if (vp?.justificativa_diferente) {
          observacoes.push("Justificativa: " + vp.justificativa_diferente);
        }

        if(vp?.justificativa_municipios) {
          observacoes.push("Justificativa: " + vp.justificativa_municipios);
        }

        tableBody.push([
          p.participante.nome || "",
          Util.formataMascaraCpf(p.participante.cpf) || "",
          p.participante.cargo || "",
          observacoes.length > 0 ? observacoes.join(", ") : "Sem observações"
        ]);

      });

      // Adicionamos a tabela compacta para esta viagem
      content.push({
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto', 'auto'],
          body: tableBody
        },
        layout: 'lightHorizontalLines',
        style: 'textoNormal',
      });
    });

    return content;
  }

  private getChaveViagem(viagem: any): ViagemKey {
    const origem = viagem.cidade_origem ?
      `${viagem.cidade_origem.descricao} - ${viagem.cidade_origem.estado?.uf}` :
      (viagem.origem ? `${viagem.origem.cidade} - ${viagem.origem.uf}` : '');

    const cidadeDestino = viagem.cidade_destino?.descricao + " - " + viagem.cidade_destino?.estado?.uf;
    const destino = viagem?.destino?.cidade === undefined ? cidadeDestino :
      viagem?.destino?.cidade + " - " + viagem?.destino?.uf;

    const dataIda = viagem.data_ida ? formataDataCurta(viagem.data_ida as Date) : '';
    const dataVolta = viagem.data_volta ? formataDataCurta(viagem.data_volta as Date) : '';
    const viagemDiferente = viagem.viagem_diferente || 'NAO';

    const chave: ViagemKey = {
      origem,
      destino,
      dataIda,
      dataVolta,
      viagemDiferente
    };

    if (viagemDiferente === 'SIM') {
      chave.dataIdaDiferente = viagem.data_ida_diferente ? formataDataCurta(viagem.data_ida_diferente as Date) : '';
      chave.dataVoltaDiferente = viagem.data_volta_diferente ? formataDataCurta(viagem.data_volta_diferente as Date) : '';
    }

    return chave;
  }

  private agruparViagens(participantes: any[]): AgrupamentoViagem[] {
    const viagensMap = new Map<string, AgrupamentoViagem>();

    // Coletamos todas as viagens de todos os participantes
    participantes.forEach(ep => {
      if (ep.viagem_participantes && ep.viagem_participantes.length > 0) {
        ep.viagem_participantes.forEach(vp => {
          const chaveViagem = this.getChaveViagem(vp.viagem);
          const chaveString = JSON.stringify(chaveViagem);

          if (!viagensMap.has(chaveString)) {
            viagensMap.set(chaveString, {
              viagem: vp.viagem,
              participantes: []
            });
          }

          viagensMap.get(chaveString)!.participantes.push({
            conta_diaria: ep.participante.conta_diaria,
            participanteId: ep.participante.id,
            participante: ep.participante,
            viagem_participante: vp
          });
        });
      }
    });

    return Array.from(viagensMap.values());
  }
}