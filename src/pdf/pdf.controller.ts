// pdf.controller.ts
import { Controller, Get, Param, Res } from '@nestjs/common';

import { Response } from 'express';
import { formataDataCurta, Util } from 'src/util/Util';
import { PdfServiceGenerator } from './pdf-service';


@Controller('pdf')
export class PdfController {

  constructor(private pdfService: PdfServiceGenerator) { }

  @Get('/:id')
  async getPdf(@Res() res: Response, @Param('id') id: number) {

    const sol = await this.pdfService.pesquisaSolicitacaoPorId(+id);

    let content: any = [];
    let resultadoPassagem = 0;
    let resultado = 0;
    let resultadoInternacional = 0;
    let cotacao = 0;

    let totalDiariaCondutor = 0;
    let totalValoresEventos = 0;

    content.push({
      image: this.base64Image,
      width: 120,
    });

    content.push({
      text: "TRIBUNAL DE CONTAS DO ESTADO DO AMAPÁ",
      style: "header",
    });

    content.push(
      {
        text: "\n",
      }
    );

    content.push(
      {
        text: "\nSOLICITAÇÃO Nº " + id,
        style: "texto",
      }

    );

    content.push({
      style: "titulosHeader",
      layout: "noBorders",
      table: {
        body: [
          ["Responsável", "Lotação", "Data Solicitação"],
          [
            sol.nome_responsavel,
            sol.lotacao,
            Util.formataDataCurtaComHora(sol.datareg ?? new Date()),
          ],
        ],
      },
    });

    content.push({ text: "\n\n", });

    content.push(
      {
        text: "Justificativa",
        style: "texto",
      },
      {
        text: sol.justificativa ?? "\n\n",
        style: "textoNormal",
      },

    );

    //EVENTOS
    
    sol.eventos?.forEach((eventos) => {

      const matchingEventos = sol.eventos?.filter((evento) => evento.id === eventos.id) ?? [];


      content.push({
        text: "\n\n" + eventos.titulo.toUpperCase(),
        style: "texto",
      });

      content.push(
        {
          text: eventos.tipo_evento?.descricao,
          style: "textoNormal",
        },
        {
          text: "De " + formataDataCurta(eventos.inicio as Date) + " a " + formataDataCurta(eventos.fim as Date) + "\n\n",
          style: "textoNormal",
        },
        {
          text: eventos.informacoes + "\n\n",
          style: "textoNormal",
        },
      );

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
        },{ text });
      });
  

      //VALORES EVENTOS
      sol.eventos?.filter((a) => a.id === eventos.id).map((data) => {

        if (data.valor_evento || data.valor_total_inscricao) {

          totalValoresEventos += (data.valor_total_inscricao!) + (data.valor_evento!);

          content.push({
            text: "\n",
          });

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
            text:
              "Observação: " + data.observacao_valor === null
                ? ""
                : data.observacao_valor,
          });
        }

        content.push({
          text: "\n\nPARTICIPANTES DO EVENTO\n\n",
          style: "texto",
        });

        eventos.evento_participantes?.forEach((ep) => {
          const conta = ep.participante.conta_diaria?.find((a) => a);
          const tipoConta = conta?.tipo_conta === "C" ? "CONTA CORRENTE" : conta?.tipo_conta === "P" ? "CONTA POUPANÇA"
              : conta?.tipo_conta === "S" ? "CONTA SALÁRIO" : "";
  
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
  
            {
              text: "\n",
            }
          );
  
          ep.viagem_participantes.forEach((vp) => {
            const custos = vp.viagem.custos?.map((custos) => {
              return this.exibeCustos(+custos);
            });
  
            //==============
            const valoresViagem = vp.viagem.valor_viagem;
  
            valoresViagem?.forEach((valor) => {
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
  
            const local = vp.viagem.cidade_destino?.descricao + " - " + vp.viagem.cidade_destino?.estado?.uf;
            const cidadeDestino = vp.viagem?.destino?.cidade === undefined ? local : vp.viagem?.destino?.cidade + " - " + vp.viagem?.destino?.uf;
  
            let origem = "";
            if (eventos.tem_passagem === "NAO") {
              origem =
                vp.viagem.cidade_origem?.descricao + " - " + vp.viagem.cidade_origem?.estado?.uf;
            } else {
              origem = vp.viagem.origem?.cidade + " - " + vp.viagem.origem?.uf;
            }
  
            let valorDiaria = 0;
            let diariasDesc = "";
  
            vp.viagem.valor_viagem?.filter((a) =>  a.participante_id === ep.participante.id && a.tipo === "DIARIA").forEach((diarias) => {
                valorDiaria += diarias.valor_individual ?? 0;
  
                if (diarias.justificativa !== undefined && diarias.justificativa?.length > 0) {
                  diariasDesc += Util.formataValorDiaria(diarias.valor_individual ?? 0, "NACIONAL") + " (Justificativa: " + diarias.justificativa +")\n";
                } else {
                  diariasDesc += Util.formataValorDiaria(diarias.valor_individual ?? 0, "NACIONAL") + "\n";
                }
              });
  
            /* BANCO AQUI */
            content.push(
              {
                style: "textoNormal",
                layout: "noBorders",
                table: {
                  body: [
                    ["DADOS BANCÁRIOS", "DADOS DA VIAGEM"],
                    [
                      // First cell of the second row
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
                      // Second cell of the second row (removed extra square brackets)
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
            //BANCO
 
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
  
            if (vp.viagem.viagem_diferente === "SIM") {
              content.push(
                {
                  text:
                    "" +
                    "Viagem com data diferentes?" +
                    vp.viagem.viagem_diferente,
                  style: "textos",
                },
                {
                  text:
                    "" +
                    "Ida: " +
                    formataDataCurta(vp.viagem.data_ida_diferente as Date),
                  style: "textos",
                },
                {
                  text:
                    "" +
                    "Volta: " +
                    formataDataCurta(vp.viagem.data_volta_diferente as Date),
                  style: "textos",
                },
                {
                  text:
                    "" +
                    "Justificativa: " +
                    vp.viagem.justificativa_diferente +
                    "\n\n",
                  style: "textos",
                }
              );
            }
  
            content.push({
              text:
                "Servidor Acompanhando Conselheiro ou Procurador Geral? " +
                vp.viagem.servidor_acompanhando +
                "\n\n",
              style: "textoNormal",
            });
  
            if (vp.viagem.viagem_pernoite === "SIM") {
              content.push({
                text:
                  "Viagem com pernoite " +
                  vp.viagem.justificativa_municipios +
                  "\n\n",
                style: "textos",
              });
            }
  
            if (vp.viagem.viagem_superior === "SIM") {
              content.push({
                text:
                  "Viagem será superir a 6 horas: " +
                  vp.viagem.justificativa_municipios +
                  "\n\n",
                style: "textos",
              });
            }
          });
  
        });

      });
    });
    //VALORES EVENTOS
    //EVENTOS  

    //MOTORISTA
    await this.exibeMotorista(sol.id!).then((condutoresDaSolicitacao) => {
      condutoresDaSolicitacao?.map((condutor, index) => {
        content.push({
          text: '\n',
        });

        if (condutor.condutores?.tipo === "S") {
          content.push(
            {
              text: "SERVIDOR/MOTORISTA PARTICULAR \n",
              style: "titulos",
            },
            {
              text:
                "Nome: " +
                condutor.condutores.nome +
                " CPF: " +
                condutor.condutores.cpf,
              style: "textos",
            },
            {
              text: "*Dados bancários nas informações de participantes \n\n",
              style: "textos",
            }
          );
        } else {
          let valorDiaria = 0;

          {
            condutor?.diaria_condutor?.map((diaria) => {
              valorDiaria = diaria.valor;
              totalDiariaCondutor += valorDiaria;
            });
          }


          //montando condutor
          content.push({
            style: "textoEmp",
            table: {
            widths: ['*'],
            body: [
                  [
                      {
                        text: 'INFORMAÇÕES DO CONDUTOR: DIRETORIA AREA ADMINISTRATIVA',
                        style: 'texto',
                      }
                    ],

                    ["Nome: " + (condutor?.condutores?.nome.toUpperCase()) + " CPF: " + (condutor?.condutores?.cpf) +'\n'+ "Matricula: " + condutor?.condutores?.matricula + '\n'
                        + "Validade CNH: " + formataDataCurta(condutor.condutores?.validade_cnh as Date) + " Categoria: " + condutor.condutores?.categoria_cnh + '\n'
                        + "Celular: " + condutor.condutores?.celular + '\n' + "Endereço: " + condutor.condutores?.endereco + '\n' + "Agencia: " + condutor.condutores?.agencia + '\n' 
                        + "CC: " + condutor.condutores?.conta + " Banco: " + condutor.condutores?.banco + "\n \n" 
                        + "Diária Condutor: " + Util.formataValorDiaria(valorDiaria, "NACIONAL") + "\n"
                        + "Veículo: " + condutor.veiculo + "\n\n"
                    ] 
      
                
                
               
              ],
            },
            
          });
        
        }
      });
    });
    //MOTORISTA

    content.push({
      text: "\n",
    });

    const addAssinaturaDAOFI = async () => {
      try {
        const ass = await this.pegarAssinaturaDoDocumentoDAOF(sol.id!);
        if (!ass?.assinatura_daof) {
          return 'Aguardando assinatura do documento.';
        }
        return 'Assinado por: ' + ass.assinatura_daof.diretor + ' em ' + Util.formataDataNovas(ass.datareg) + ' as '+ass.hora;
      } catch (error) {
        console.error('Erro ao buscar assinatura:', error);
        return 'Não foi possível carregar a assinatura.';
      }
    };
    
    const assinaturaDAOFI = await addAssinaturaDAOFI();

    try{
      content.push(
        {
          style: 'justificativa',
          table: {
            widths: ['*'],
            body: [
              ['DISPONIBILIDADE: DIRETORIA DA AREA ORCAMENTÁRIA FINANCEIRA/DAOFI'],
              [sol.empenho_daofi?.map(a => {
                return (
  
                  ['Data: ' + Util.formataDataNovas(a.datareg), 
                  a.tipo === "D" ? "Diárias 339014" : a.tipo === "P" ? "Passagens 339033" : a.tipo === "I" ? "Inscrição/Curso 339039"  :
                  a.tipo === "F" ? "\nPessoa Física 339036" : '',
                  'Saldo Inicial: ' + Util.formataValorDiaria(a.saldo_inicial, 'NACIONAL') +
                  '\nValor Reservado: ' + Util.formataValorDiaria(a.valor_reservado, 'NACIONAL') + 
                  '\nValor Pós Reserva: ' + Util.formataValorDiaria(a.valor_pos_reserva ?? 0, 'NACIONAL') + '\n',
                  a.acao === '2072' ? 'AÇÂO 2072 - Planejamento Estratégico 2024 a 2028\n\n' : '' +
                  a.acao === '2446' ? 'AÇÃO 2446 - MANUTENÇÃO E FUNCIONAMENTO DO TCE/AP E DO PRÉDIO ANEXO\n\n' : '' +
                  a.acao === '2445' ? 'AÇÃO 2445 - TREINAMENTO E CAPACITAÇÃO DE RECURSOS HUMANOS\n\n' : '' +
                  '\nObservação: ' + a.observacao]
                )
            })],
            
              [''+assinaturaDAOFI]
            ]
          }
        },
      )
    }catch(e) {
      console.log(e);
      
    }
    

    const docDefinition = {
      content: content,
      styles: {
        header: {
          fontSize: 14,
          bold: true,
        },
        texto: {
          fontSize: 12,
          bold: true,
        },
        textoNormal: {
          fontSize: 11,
          bold: false,
        },
        titulosHeader: {
          fontSize: 11,
          bold: true,
        },



      },
    };

    try {
      const pdfBuffer = await this.pdfService.generatePdf(docDefinition);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="Diaria.pdf"');

      res.send(pdfBuffer);
    } catch (err) {
      console.log(err);

      res.status(500).send('Error generating PDF');
    }
  }


  pegarAssinaturaDoDocumentoDAOF = async (solicitacaoId: number) => {
    return await this.pdfService
      .getAssinaturaDoDocumentoDAOF(solicitacaoId);
  };


  exibeCustos = (index: number): string => {
    const custos = [
      "Viagem - trecho de ida ou volta",
      "Inscrição de cursos e eventos",
      "Outros",
    ];
    return custos[index];
  };

  exibeMotorista = async (solicitacaoId: number) => {
    try {
      const data = await this.pdfService.getCondutoresDaSolicitacao(solicitacaoId);
      return data;
    } catch (error) {
      // Se ocorrer um erro, verifique se é um erro 404
      if ((error as any).response && (error as any).response.status === 404) {
        return [];
      } else {
        return [];
      }
    }
  };



  base64Image: string =
    "data:image/png;base64,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"; // Substitua pela sua imagem base64


}
