import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { CreateLogTramiteDto } from 'src/log_tramite/dto/create-log_tramite.dto';
import { LogTramiteService } from 'src/log_tramite/log_tramite.service';
import { EmailService } from 'src/email/email.service';
import { StatusSolicitacao } from './status_enum';

@Injectable()
export class TramiteService {
  constructor(private prisma: PrismaService, private logTramiteService: LogTramiteService, private emailService: EmailService) {}

  async create(dto: CreateTramiteDto, nome: string) {
    const { solicitacao, ...dtoSemSolicitacao } = dto;

    const resultado = await this.prisma.tramite.create({
      data: dtoSemSolicitacao,
    });

    const id = (await resultado).id;
    await this.salvarLogTramite(dto, nome, id);

    //this.emailService.enviarEmail(dto.solicitacao_id+'', dto.status);
    console.log(nome);

    /* DAOF 
        Alessandra Patrícia Rodrigues dos Santos.
        Cristiane Barbosa Dias.
        Neuma Maria Almeida de Azevedo. 
        
        DARAD
        Betânia da Silva Barros
        Clarisse Dias Magalhães
        Joanne Dias Quintas de Aguiar 
        
        */
    

   // await this.enviarNotificacaoDoStatus(dto.status, dto.solicitacao_id);

    return resultado;
  }

  
  async enviarNotificacaoDoStatus(status: string, solicitacaoId: number) {

    const solicitacao = await this.prisma.solicitacao.findFirst({
      where: {id: solicitacaoId}
    });


    //tem que ser as pessoas do permitidas do e-tce/protocolo
    if (status === 'SOLICITADO') {
      this.enviaPresidencia(status, solicitacaoId);
    }

    if (status === 'APROVADO') {
      this.enviaResposta(status, solicitacaoId, solicitacao.login);
    }

    return null;
  }

  async enviaPresidencia(status: string, solicitacaoId: number){
    this.emailService.enviarEmail(solicitacaoId, status,'wendell.sacramento');
      /* this.emailService.enviarEmail(solicitacaoId, status,'cons.michelhouat');
      this.emailService.enviarEmail(solicitacaoId, status,'antonio.correa');
      this.emailService.enviarEmail(solicitacaoId, status,'luzia.coelho');
      this.emailService.enviarEmail(solicitacaoId, status,'alana.castro'); */
  }

  async enviaResposta(status: string, solicitacaoId: number, resposta: string){
    this.emailService.enviarEmail(solicitacaoId, status,resposta);
}




  async salvarLogTramite(dto: CreateTramiteDto, nome: string, tramiteId: number) {
    const dados: CreateLogTramiteDto = {
      cod_lotacao_origem: dto.cod_lotacao_origem,
      cod_lotacao_destino: dto.cod_lotacao_destino,
      datareg: new Date(),
      nome: nome,
      lotacao_destino: dto.lotacao_destino,
      lotacao_origem: dto.lotacao_origem,
      status: dto.status,
      tramite_id: tramiteId,
    };

    return await this.logTramiteService.create(dados);
  }

  findAll() {
    return this.prisma.tramite.findMany({
      include: {
        solicitacao: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  findTramitePorLotacao(codLotacao: number) {
    return this.prisma.tramite.findMany({
      where: {
        OR: [{ cod_lotacao_destino: codLotacao }, { cod_lotacao_origem: codLotacao }],
      },
      include: {
        solicitacao: {
          include: {
            tramite: true,
            empenho_daofi: true,
            eventos: {
              include: {
                evento_participantes: {
                  include: {
                    participante: true,
                    viagem_participantes: {
                      include: {
                        viagem: {
                          include: {
                            origem: true,
                            destino: true,
                            cidade_origem: true,
                            cidade_destino: true,
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
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  findTramitePorLotacaoAprovadosDaOrigem(codLotacao: number) {
    return this.prisma.tramite.findMany({
      where: { cod_lotacao_origem: codLotacao },
      include: {
        solicitacao: {
          include: {
            tramite: true,
            empenho_daofi: true,
            eventos: {
              include: {
                evento_participantes: {
                  include: {
                    participante: true,
                    viagem_participantes: {
                      include: {
                        viagem: {
                          include: {
                            origem: true,
                            destino: true,
                            cidade_origem: true,
                            cidade_destino: true,
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
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  findTramitePresidencia() {
    return this.prisma.tramite.findMany({
      include: {
        solicitacao: {
          include: {
            tramite: true,
            empenho_daofi: true,
            eventos: {
              include: {
                evento_participantes: {
                  include: {
                    participante: true,
                    viagem_participantes: {
                      include: {
                        viagem: {
                          include: {
                            origem: true,
                            destino: true,
                            cidade_origem: true,
                            cidade_destino: true,
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
        },
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  findOne(id: number) {
    return this.prisma.tramite.findFirst({
      where: {
        id: +id,
      },
    });
  }

  findOneSolicitacao(id: number) {
    return this.prisma.tramite.findFirst({
      where: {
        solicitacao_id: +id,
      },
      orderBy: [{ id: 'desc' }],
      include: {
        log_tramite: {
          include: {
            tramite: true,
          },
        },
        solicitacao: {
          include: {
            empenho_daofi: true,
            correcao_solicitacao: true,
            eventos: {
              include: {
                tipo_evento: true,
                pais: true,
              },
            },
          },
        },
      },
    });
  }

  findEmpenhados() {
    return this.prisma.tramite.findMany({
      where: {
        status: 'EMPENHADO',
      },
      include: {
        solicitacao: {
          include: {
            empenho_daofi: true,
            tramite: true,
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
        },
      },
      orderBy: [{ id: 'desc' }, { datareg: 'desc' }],
    });
  }

  findConcluidas() {
    return this.prisma.tramite.findMany({
      where: {
        status: 'CONCLUIDO',
      },
      include: {
        solicitacao: {
          include: {
            tramite: true,
            empenho_daofi: true,
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
                pais: true,
                tipo_evento: true,
                cidade: {
                  include: {
                    estado: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: [{ id: 'desc' }, { datareg: 'desc' }],
    });
  }

  
  async update(id: number, dto: UpdateTramiteDto, nome?: string) {
    const { solicitacao, ...dtoSemSolicitacao } = dto;

    this.salvarLogTramite(dto as CreateTramiteDto, nome, id);

    //await this.enviarNotificacaoDoStatus(dto.status, dto.solicitacao_id);

    return this.prisma.tramite.update({
      where: { id },
      data: dtoSemSolicitacao,
    });
  }

  updateStatus(id: number, status: string, nome: string, dto: CreateTramiteDto) {
    /* const data = this.prisma.tramite.findUnique({
      where: {
        id: id,
      }
    }).then((dto) => { */

    const dados: CreateLogTramiteDto = {
      cod_lotacao_origem: dto.cod_lotacao_origem,
      cod_lotacao_destino: dto.cod_lotacao_destino,
      datareg: new Date(),
      nome: nome,
      lotacao_destino: dto.lotacao_destino,
      lotacao_origem: dto.lotacao_origem,
      status: status,
      tramite_id: id,
    };

    this.salvarLogTramite(dto, nome, id);

    //});

    return this.prisma.tramite.update({
      where: { id },
      data: {
        status: status.toUpperCase(),
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
