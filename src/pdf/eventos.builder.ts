import { Injectable } from '@nestjs/common';
import { fontSize } from 'pdfkit';
import { formataDataCurta, Util } from 'src/util/Util';

interface EventosBuilderData {
  eventos: any[];
}

// Interface para auxiliar o agrupamento de viagens
interface ViagemKey {
  origem: string;
  destino: string;
  dataIda: string;
  dataVolta: string;
  viagemDiferente: string;
  dataIdaDiferente?: string;
  dataVoltaDiferente?: string;
}

// Interface para viagens agrupadas
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
          text: "Local do Evento: "+text,
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
                ['Valor unitário: ' + Util.formataValorDiaria(data.valor_total_inscricao!, "NACIONAL") +
                  '\n' + 'Valor total: ' + Util.formataValorDiaria(data.valor_evento!, "NACIONAL") +
                  '\n' + "Observação: " + data.observacao_valor]
              ]
            }
          });
        } else {
          content.push({
            text: "Observação: " + data.observacao_valor === null ? "" : data.observacao_valor,
          });
        }

        // Adicionar participantes
        content.push({
          text: "\n\nPARTICIPANTES DO EVENTO\n\n",
          style: "texto",
        });

        // Renderizar participantes e suas viagens (agrupadas quando possível)
        content.push(...this.renderParticipantesComViagensAgrupadas(evento.evento_participantes));
      });
    });

    return content;
  }

  private renderParticipantesComViagensAgrupadas(participantes: any[]): any[] {
    const content = [];
  
    if (!participantes || participantes.length === 0) {
      return content;
    }
  
    // Agrupamos os participantes em pares
    for (let i = 0; i < participantes.length; i += 2) {
      const leftParticipant = participantes[i];
      const rightParticipant = i + 1 < participantes.length ? participantes[i + 1] : null;
      
      // Cria tabela com dois participantes lado a lado
      const rowContent = {
        columns: [
          // Primeiro participante (esquerda)
          {
            width: rightParticipant ? '50%' : '*', // Se não tiver participante à direita, ocupa toda largura
            style: "textoNormal",
            layout: "noBorders",
            table: {
              body: [
                ["Nome:", leftParticipant.participante.nome],
                [
                  "Matrícula: ",
                  leftParticipant.participante.matricula === null
                    ? "Colaborador/Teceirizado"
                    : leftParticipant.participante.matricula,
                ],
                [
                  "Data Nasc:", formataDataCurta(new Date(Date.parse(leftParticipant.participante.data_nascimento))),
                ],
                ["CPF:", Util.formataMascaraCpf(leftParticipant.participante.cpf)],
                ["E-mail:", leftParticipant.participante.email],
                ["Lotação:", leftParticipant.participante.lotacao],
                ["Cargo:", leftParticipant.participante.cargo],
              ],
            },
          }
        ]
      };
      
      // Adiciona o segundo participante ao lado direito (se existir)
      if (rightParticipant) {
        rowContent.columns.push({
          width: '50%',
          style: "textoNormal",
          layout: "noBorders",
          table: {
            body: [
              ["Nome:", rightParticipant.participante.nome],
              [
                "Matrícula: ",
                rightParticipant.participante.matricula === null
                  ? "Colaborador/Teceirizado"
                  : rightParticipant.participante.matricula,
              ],
              [
                "Data Nasc:", formataDataCurta(new Date(Date.parse(rightParticipant.participante.data_nascimento))),
              ],
              ["CPF:", Util.formataMascaraCpf(rightParticipant.participante.cpf)],
              ["E-mail:", rightParticipant.participante.email],
              ["Lotação:", rightParticipant.participante.lotacao],
              ["Cargo:", rightParticipant.participante.cargo],
            ],
          },
        });
      }
      
      content.push(rowContent);
      content.push({ text: "\n" });
    }
  
    // Depois agrupamos as viagens semelhantes
    const viagensAgrupadas = this.agruparViagens(participantes);
    
    // Adicionamos a seção de viagens com agrupamento
    if (viagensAgrupadas.length > 0) {
      content.push({
        text: "\n\nVIAGENS\n\n",
        style: "texto",
      });
      
      content.push(...this.renderViagensAgrupadas(viagensAgrupadas));
    }
  
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
            participante: ep.participante,
            viagem_participante: vp
          });
        });
      }
    });
    
    return Array.from(viagensMap.values());
  }

  private renderViagensAgrupadas(viagensAgrupadas: AgrupamentoViagem[]): any[] {
    const content = [];
    
    viagensAgrupadas.forEach((agrupamento, index) => {
      const viagem = agrupamento.viagem;
      const participantes = agrupamento.participantes;
      
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
      
      // Título da viagem e participantes
      content.push({
        text: `\nViagem ${index + 1}: ${origem} → ${cidadeDestino}`,
        style: "subheader"
      });

      content.push({
        text: `Ida: ${viagem.data_ida ? formataDataCurta(viagem.data_ida as Date) : "Não especificada"}`,
        style: "textoNormal",
      });

      if (viagem.deslocamento === "SIM") {
        content.push({
          text: "Com deslocamento",
          style: "textoNormal",
        });
      } else {
        content.push({
          text: `Volta: ${viagem.data_volta ? formataDataCurta(viagem.data_volta as Date) : "Não especificada"}`,
          style: "textoNormal",
        });
      }
      
      // Lista de participantes na viagem
      content.push({
        text: `\nParticipantes desta viagem (${participantes.length}):`,
        style: "textoNormal"
      });
      
      const participantesNomes = participantes.map((p, idx) => 
        `${idx + 1}. ${p.participante.nome}`
      );
      
      content.push({
        ul: participantesNomes,
        style: "textoNormal"
      });
      
      // Custos da viagem
      const custos = viagem.custos?.map((custoIndex) => {
        const custosOpcoes = [
          "Viagem - trecho de ida ou volta",
          "Inscrição de cursos e eventos",
          "Outros",
        ];
        return custosOpcoes[custoIndex] || "Custo não especificado";
      });
      
      // Informações adicionais sobre a viagem
      content.push({
        text: "\nDetalhes da viagem:",
        style: "textoNormal"
      });
      
      // Informações sobre viagem com datas diferentes
      if (viagem.viagem_diferente === "SIM") {
        content.push({
          text: "Viagem com datas diferentes",
          style: "textoNormal",
        });
        
        content.push({
          text: `Ida diferente: ${formataDataCurta(viagem.data_ida_diferente as Date)}`,
          style: "textoNormal",
        });
        
        content.push({
          text: `Volta diferente: ${formataDataCurta(viagem.data_volta_diferente as Date)}`,
          style: "textoNormal",
        });
        
        content.push({
          text: `Justificativa: ${viagem.justificativa_diferente}`,
          style: "textoNormal",
        });
      }
      
      // Informações sobre arcar com custos
      content.push({
        text: `Vai arcar com algum custo? ${viagem.arcar_passagem || "NÃO"}`,
        style: "textoNormal",
      });
      
      if (viagem.arcar_passagem === "SIM") {
        content.push({
          text: `Custos: ${custos}`,
          style: "textoNormal",
        });
        
        content.push({
          text: `Justificativa: ${viagem.justificativa}`,
          style: "textoNormal",
        });
      }
      
      // Informações sobre servidor acompanhando
      content.push({
        text: `Servidor Acompanhando Conselheiro ou Procurador Geral? ${viagem.servidor_acompanhando || "NÃO"}`,
        style: "textoNormal",
      });
      
      // Informações sobre pernoite
      if (viagem.viagem_pernoite === "SIM") {
        content.push({
          text: `Viagem com pernoite: ${viagem.justificativa_municipios}`,
          style: "textoNormal",
        });
      }
      
      // Informações sobre viagem superior a 6 horas
      if (viagem.viagem_superior === "SIM") {
        content.push({
          text: `Viagem será superior a 6 horas: ${viagem.justificativa_municipios}`,
          style: "textoNormal",
        });
      }
      
      // Informações individuais de diárias por participante
      content.push({
        text: "\nInformações de diárias por participante:",
        style: "textoNormal"
      });
      
      participantes.forEach(p => {
        let valorDiaria = 0;
        let diariasDesc = "";
        
        if (viagem.valor_viagem) {
          viagem.valor_viagem
            .filter((a) => a.participante_id === p.participante.id && a.tipo === "DIARIA")
            .forEach((diaria) => {
              valorDiaria += diaria.valor_individual ?? 0;
  
              if (diaria.justificativa !== undefined && diaria.justificativa?.length > 0) {
                diariasDesc += Util.formataValorDiaria(diaria.valor_individual ?? 0, "NACIONAL") + " (Justificativa: " + diaria.justificativa + ")\n";
              } else {
                diariasDesc += Util.formataValorDiaria(diaria.valor_individual ?? 0, "NACIONAL") + "\n";
              }
            });
        }

        
        const conta = p.participante.conta_diaria?.find((a) => a);
        const tipoConta = conta?.tipo_conta === "C" ? "CONTA CORRENTE" : 
                          conta?.tipo_conta === "P" ? "CONTA POUPANÇA" :
                          conta?.tipo_conta === "S" ? "CONTA SALÁRIO" : "";
        
        content.push({
          text: `\nParticipante: ${p.participante.nome}`,
          style: "textoNormal"
        });
        
        content.push({
          text: `Valor Diária: ${diariasDesc || "Não informado"}`,
          style: "textoNormal",
        });
        
        content.push({
          style: "textoNormal",
          layout: "noBorders",
          table: {
            body: [
              ["DADOS BANCÁRIOS", ""],
              [
                {
                  style: "textoNormal",
                  layout: "noBorders",
                  table: {
                    body: [
                      ["Banco:", conta?.banco?.banco ?? ""],
                      ["Tipo:", tipoConta],
                      ["Agência:", conta?.agencia ?? ""],
                      ["Conta:", conta?.conta ?? ""],
                    ],
                  },
                },
                ""
              ],
            ],
          },
        });
      });
      
      // Separador entre viagens
      content.push({ text: "\n" + "-".repeat(30) + "\n", style: "textoNormal" });
    });
    
    return content;
  }

  private renderParticipantes(participantes: any[]): any[] {
    const content = [];

    if (!participantes || participantes.length === 0) {
      return content;
    }

    participantes.forEach((ep) => {
      const conta = ep.participante.conta_diaria?.find((a) => a);
      const tipoConta = conta?.tipo_conta === "C" ? "CONTA CORRENTE" : 
                        conta?.tipo_conta === "P" ? "CONTA POUPANÇA" :
                        conta?.tipo_conta === "S" ? "CONTA SALÁRIO" : "";

      // Dados do participante
      content.push(
        {
          style: "textoNormal",
          layout: "noBorders",
          table: {
            body: [
              ["Nome:", ep.participante.nome],
              [
                "Matrícula: ",
                ep.participante.matricula === null
                  ? "Colaborador/Teceirizado"
                  : ep.participante.matricula,
              ],
              [
                "Data Nasc:", formataDataCurta(new Date(Date.parse(ep.participante.data_nascimento))),
              ],
              ["CPF:", Util.formataMascaraCpf(ep.participante.cpf)],
              ["E-mail:", ep.participante.email],
              ["Lotação:", ep.participante.lotacao],
              ["Cargo:", ep.participante.cargo],
            ],
          },
        },
        { text: "\n" }
      );

      // Renderizar viagens do participante (mantido para compatibilidade, mas será substituído pela versão agrupada)
      content.push(...this.renderViagens(ep));
    });

    return content;
  }

  private renderViagens(participanteEvento: any): any[] {
    const content = [];
    
    if (!participanteEvento.viagem_participantes || participanteEvento.viagem_participantes.length === 0) {
      return content;
    }

    participanteEvento.viagem_participantes.forEach((vp) => {
      const conta = participanteEvento.participante.conta_diaria?.find((a) => a);
      const tipoConta = conta?.tipo_conta === "C" ? "CONTA CORRENTE" : 
                        conta?.tipo_conta === "P" ? "CONTA POUPANÇA" :
                        conta?.tipo_conta === "S" ? "CONTA SALÁRIO" : "";

      // Custos da viagem
      const custos = vp.viagem.custos?.map((custoIndex) => {
        const custosOpcoes = [
          "Viagem - trecho de ida ou volta",
          "Inscrição de cursos e eventos",
          "Outros",
        ];
        return custosOpcoes[custoIndex] || "Custo não especificado";
      });

      // Calcula valores da viagem
      let resultadoPassagem = 0;
      let resultado = 0;
      let resultadoInternacional = 0;
      let cotacao = 0;

      const valoresViagem = vp.viagem.valor_viagem;
      if (valoresViagem) {
        valoresViagem.forEach((valor) => {
          if (valor.tipo === "PASSAGEM") {
            resultadoPassagem += valor.valor_grupo || valor.valor_individual || 0;
          }
          if (valor.tipo === "DIARIA" && valor.destino === "NACIONAL") {
            resultado += valor.valor_individual || 0;
          }
          if (valor.tipo === "DIARIA" && valor.destino?.trim() === "INTERNACIONAL") {
            resultadoInternacional += valor.valor_individual || 0;
            cotacao = valor.cotacao_dolar || 0;
          }
        });
      }

      // Formata destino e origem
      const local = vp.viagem.cidade_destino?.descricao + " - " + vp.viagem.cidade_destino?.estado?.uf;
      const cidadeDestino = vp.viagem?.destino?.cidade === undefined ? local : vp.viagem?.destino?.cidade + " - " + vp.viagem?.destino?.uf;

      let origem = "";
      if (vp.viagem.evento?.tem_passagem === "NAO") {
        origem = vp.viagem.cidade_origem?.descricao + " - " + vp.viagem.cidade_origem?.estado?.uf;
      } else {
        origem = vp.viagem.origem?.cidade + " - " + vp.viagem.origem?.uf;
      }

      // Calcula valor de diárias
      let valorDiaria = 0;
      let diariasDesc = "";

      if (vp.viagem.valor_viagem) {
        vp.viagem.valor_viagem
          .filter((a) => a.participante_id === participanteEvento.participante.id && a.tipo === "DIARIA")
          .forEach((diaria) => {
            valorDiaria += diaria.valor_individual ?? 0;

            if (diaria.justificativa !== undefined && diaria.justificativa?.length > 0) {
              diariasDesc += Util.formataValorDiaria(diaria.valor_individual ?? 0, "NACIONAL") + " (Justificativa: " + diaria.justificativa + ")\n";
            } else {
              diariasDesc += Util.formataValorDiaria(diaria.valor_individual ?? 0, "NACIONAL") + "\n";
            }
          });
      }

      // Informações bancárias e da viagem
      content.push(
        {
          style: "textoNormal",
          layout: "noBorders",
          table: {
            body: [
              ["DADOS BANCÁRIOS", "DADOS DA VIAGEM"],
              [
                // Dados bancários
                {
                  style: "textoNormal",
                  layout: "noBorders",
                  table: {
                    body: [
                      ["Banco:", conta?.banco?.banco ?? ""],
                      ["Tipo:", tipoConta],
                      ["Agência:", conta?.agencia ?? ""],
                      ["Conta:", conta?.conta ?? ""],
                    ],
                  },
                },
                // Dados da viagem
                {
                  style: "textoNormal",
                  layout: "noBorders",
                  table: {
                    body: [
                      ["Origem:", origem ?? ""],
                      [
                        "Ida:",
                        vp.viagem.data_ida
                          ? formataDataCurta(vp.viagem.data_ida as Date)
                          : "",
                      ],
                      [
                        "Destino:",
                        cidadeDestino ??
                          (vp.viagem.cidade_destino?.descricao ?? "") +
                            " - " +
                            (vp.viagem.cidade_destino?.uf ?? ""),
                      ],
                      [
                        "",
                        vp.viagem.deslocamento === "SIM"
                          ? "Deslocamento"
                          : vp.viagem.data_volta
                          ? "Volta: " + formataDataCurta(vp.viagem.data_volta as Date)
                          : "",
                      ],
                    ],
                  },
                },
              ],
            ],
          },
        },
        {
          text: "Valor Diária " + (diariasDesc ?? ""),
          style: "texto",
        },
        {
          text: "\nVai arcar com algum custo? " + (vp.viagem.arcar_passagem ?? "") + "\n",
          style: "textoNormal",
        }
      );

      // Informações adicionais se arcar com algum custo
      if (vp.viagem.arcar_passagem === "SIM") {
        content.push(
          {
            text: "" + custos,
          },
          {
            text: "Justificativa: " + vp.viagem.justificativa + "\n\n",
            style: "textos",
          }
        );
      }

      // Informações sobre viagem com datas diferentes
      if (vp.viagem.viagem_diferente === "SIM") {
        content.push(
          {
            text: "" + "Viagem com data diferentes?" + vp.viagem.viagem_diferente,
            style: "textos",
          },
          {
            text: "" + "Ida: " + formataDataCurta(vp.viagem.data_ida_diferente as Date),
            style: "textos",
          },
          {
            text: "" + "Volta: " + formataDataCurta(vp.viagem.data_volta_diferente as Date),
            style: "textos",
          },
          {
            text: "" + "Justificativa: " + vp.viagem.justificativa_diferente + "\n\n",
            style: "textos",
          }
        );
      }

      // Informações sobre servidor acompanhando
      content.push({
        text: "Servidor Acompanhando Conselheiro ou Procurador Geral? " + vp.viagem.servidor_acompanhando + "\n\n",
        style: "textoNormal",
      });

      // Informações sobre pernoite
      if (vp.viagem.viagem_pernoite === "SIM") {
        content.push({
          text: "Viagem com pernoite " + vp.viagem.justificativa_municipios + "\n\n",
          style: "textos",
        });
      }

      // Informações sobre viagem superior a 6 horas
      if (vp.viagem.viagem_superior === "SIM") {
        content.push({
          text: "Viagem será superir a 6 horas: " + vp.viagem.justificativa_municipios + "\n\n",
          style: "textos",
        });
      }
    });

    return content;
  }
}