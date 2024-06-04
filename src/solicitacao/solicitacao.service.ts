import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Operacao } from 'src/log_sistema/log_enum';
import { InfoUsuario, LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import PesquisaSolicitacaoDTO from './dto/pesquisa-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { ConsultaSetoresDto } from './dto/consulta-setores.dto';
import { Solicitacao } from './entities/solicitacao.entity';

@Injectable()
export class SolicitacaoService {
  constructor(private prisma: PrismaService, private logSistemaService: LogSistemaService) {}

  async create(dto: CreateSolicitacaoDto, usuario: InfoUsuario): Promise<CreateSolicitacaoDto> {
    this.logSistemaService.createLog(dto, usuario, Operacao.INSERT);

    return this.prisma.solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.solicitacao.findMany({
      orderBy: [{ id: 'desc' }],
    });
  }

  findSolicitacoesDeAcordoComSetor(consulta: ConsultaSetoresDto) {
    const resultado = this.prisma.solicitacao.findMany({
      where: {
        datareg: {
          gte: new Date(consulta.dataInicio),
          lte: new Date(consulta.dataFim),
        },

        cod_lotacao: {
          in: consulta.ids,
        },
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });

    const todos = this.prisma.solicitacao.findMany({
      where: {
        cod_lotacao: {
          in: consulta.ids,
        },
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });

    if (consulta.dataInicio && consulta.dataFim) {
      return resultado;
    } else {
      return todos;
    }
  }

  findOne(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      },
      include: {
        empenho_daofi: true,
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        eventos: {
          include: {
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        valor_viagem: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findAllByLogin(login: string) {
    return this.prisma.solicitacao.findMany({
      where: {
        login: login,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findAllByLotacao(codLotacao: number) {
    return this.prisma.solicitacao.findMany({
      where: {
        cod_lotacao: codLotacao,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  pesquisarSolicitacaoPorNumero(numero: number) {
    return this.prisma.solicitacao.findMany({
      where: {
        id: numero
      },
      include: {
        tramite: true,
        correcao_solicitacao: true,
        empenho_daofi: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
    });
  }

  detalhesDaSolicitacao(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
    });
  }

  pesquisarSolicitacoes(dto: PesquisaSolicitacaoDTO) {
    return this.prisma.solicitacao.findMany({
      where: {
        AND: [
          {
            cpf_responsavel: dto?.cpf_responsavel,
            cod_lotacao: dto?.cod_lotacao,
          },

          {
            datareg: {
              gte: new Date(dto.dataInicio),
              lte: new Date(dto.dataFim),
            },
          },
          {
            tramite: {
              some: {
                status: dto.status,
              },
            },
          },
        ],

        /* OR: [
          {
            tramite: {
              every: {
                status: dto.status
              }
            }
          }
        ] */
      },
      include: {
        tramite: true,
        correcao_solicitacao: true,
        empenho_daofi: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
    });
  }

  pesquisarResponsaveis() {
    return this.prisma.solicitacao.findMany({
      distinct: ['nome_responsavel'],
      orderBy: [{ nome_responsavel: 'asc' }],
    });
  }

  async update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto, usuario: InfoUsuario) {
    this.logSistemaService.createLog(updateSolicitacaoDto, usuario, Operacao.UPDATE);

    if (updateSolicitacaoDto.status === 'PDF_GERADO') {
      return this.prisma.solicitacao.update({
        where: { id },
        data: {
          status: 'PDF_GERADO',
          protocolo: updateSolicitacaoDto.protocolo          
        },
      });
    }

    return this.prisma.solicitacao.update({
      where: { id },
      data: {
        justificativa: updateSolicitacaoDto.justificativa,
      },
    });
  }

  async remove(id: number, usuario: InfoUsuario) {
    const copia = await this.findOne(id);

    await this.logSistemaService.createLog(copia, usuario, Operacao.DELETE);

    /* const resultado = await this.prisma.solicitacao.delete({
      where: {
        id: id,
      },
    }); */

    const result = await this.removerDadosPorSolicitacao(id);

    return result;
  }

  async removerDadosPorSolicitacao(solicitacaoId: number) {
    try {
      const result = await this.prisma.$executeRaw`SELECT remover_geral_darad(${solicitacaoId}::INTEGER)`;
      //console.log(result);
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async removeDARAD(id: number, usuario: InfoUsuario) {
    const copia = await this.findOne(id);

    await this.logSistemaService.createLog(copia, usuario, Operacao.DELETE);

    const result = await this.removerDadosPorSolicitacaoDARAD(id);

    return result;
  }

  async removerDadosPorSolicitacaoDARAD(solicitacaoId: number) {
    try {
      const result = await this.prisma.$executeRaw`SELECT remover_geral_darad(${solicitacaoId}::INTEGER)`;
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async getSolicitacoesTransparencia(page: number, limit: number): Promise<Solicitacao[]> {
    const skip = (page - 1) * limit;
    return this.prisma.solicitacao.findMany({
      skip: +skip,
      take: +limit,
      orderBy: {
        datareg: 'desc',
      },
      where: {
        status: 'PDF_GERADO',
      },
      
      select: {
        id: true,
        eventos: {
          select: {
            titulo: true,
            evento_participantes: {
               select: {
                participante: {
                  select: {
                    nome: true,
                    cargo: true,
                  }
                },
                viagem_participantes: {
                  select: {
                    viagem: {
                      select: {                      
                        data_ida: true,
                        data_volta: true,
                        valor_viagem: {
                          orderBy: {
                            id: 'desc',
                          },
                          take: 1,
                          select: {
                            valor_individual: true,
                            valor_grupo: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            
          },
        },
      },
      
      
    }
    

      
   );
  }


  async getSolicitacoesCount(): Promise<number> {
    return this.prisma.solicitacao.findMany({
      where: {
        status: 'PDF_GERADO'
      },
    }).then((solicitacoes) => {
      return solicitacoes.length;
    });
  }

}

  /* async getDadosTransparencia(page: number, limit: number): Promise<DadosTransparencia[]> {
    const solicitacoes = await this.getSolicitacoesTransparencia(page, limit);
  
    return solicitacoes.map(solicitacao => {
      const participante = solicitacao.eventos?.[0]?.evento_participantes?.[0]?.participante;
      const viagem = solicitacao.eventos?.[0]?.evento_participantes?.[0]?.viagem_participantes?.[0]?.viagem;
      const diarias = viagem?.valor_viagem || [];
      const valorTotalDiariaRecebido = diarias.reduce((total, diaria) => total + diaria.valor, 0);
      const numeroDiariasUsufruidas = diarias.length;
      const periodoAfastamento = viagem ? `${viagem.dataInicio} a ${viagem.dataVolta}` : '';
      const motivoAfastamento = viagem?.motivo || '';
  
      return {
        nomeBeneficiario: participante?.nome || '',
        cargoFuncao: participante?.cargo || '',
        valorTotalDiariaRecebido,
        numeroDiariasUsufruidas,
        periodoAfastamento,
        motivoAfastamento,
      };
    });
  }  
} */




/* type DadosTransparencia = {
  nomeBeneficiario: string;
  cargoFuncao: string;
  valorTotalDiariaRecebido: number;
  numeroDiariasUsufruidas: number;
  periodoAfastamento: string;
  motivoAfastamento: string;
}; */