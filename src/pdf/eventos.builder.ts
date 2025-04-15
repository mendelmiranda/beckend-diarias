// builders/sections/eventos.builder.ts
import { Injectable } from '@nestjs/common';
import { formataDataCurta, Util } from 'src/util/Util';

interface EventosBuilderData {
  eventos: any[];
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
          style: "textoNormal",
        },
        {
          text: "De " + formataDataCurta(evento.inicio as Date) + " a " + formataDataCurta(evento.fim as Date) + "\n\n",
          style: "textoNormal",
        },
        {
          text: evento.informacoes + "\n\n",
          style: "textoNormal",
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
          text: "Local do Evento: ",
          style: "textoNormal",
        }, { text });
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

        // Renderizar participantes
        content.push(...this.renderParticipantes(evento.evento_participantes));
      });
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
              ["RG:", ep.participante.rg],
              ["CPF:", Util.formataMascaraCpf(ep.participante.cpf)],
              ["E-mail:", ep.participante.email],
              ["Telefone:", ep.participante.telefone],
              ["Lotação:", ep.participante.lotacao],
              ["Cargo:", ep.participante.cargo],
            ],
          },
        },
        { text: "\n" }
      );

      // Renderizar viagens do participante
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
                      ["Tipo:", tipoConta ?? ""],
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