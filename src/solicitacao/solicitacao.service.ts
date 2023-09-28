import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import PesquisaSolicitacaoDTO from './dto/pesquisa-solicitacao.dto';
import { InfoUsuario, LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { solicitacao } from '@prisma/client';



@Injectable()
export class SolicitacaoService {
  constructor(private prisma: PrismaService,
    private logSistemaService: LogSistemaService) {}

  async create(dto: CreateSolicitacaoDto, usuario: InfoUsuario): Promise<CreateSolicitacaoDto> {

    this.logSistemaService.createLog(dto, usuario);

    return this.prisma.solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.solicitacao.findMany({
      orderBy: [{ id: 'desc' }],
    });
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
          }
        },
        eventos: {
          include: {
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true
                      }
                    }
                  }
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
                        banco: true
                      }
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
                          }
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

  detalhesDaSolicitacao(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          }
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
                        banco: true
                      }
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
                          }
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
            
        AND: [{
          cpf_responsavel: dto?.cpf_responsavel,
          cod_lotacao: dto?.cod_lotacao
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
              status: dto.status
            }
          }
        }
        
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
                        banco: true
                      }
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
                          }
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
    return this.prisma.solicitacao.findMany(
      {
        distinct: ['nome_responsavel'],
        orderBy: [{ nome_responsavel: 'asc' }]
      }
    )
  }

  update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return this.prisma.solicitacao.update({
      where: { id },
      data: updateSolicitacaoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.solicitacao.delete({
      where: {
        id: id
      }
    })
  }

}
