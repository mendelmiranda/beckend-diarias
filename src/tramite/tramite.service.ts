import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { participante } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { EmailService } from 'src/email/email.service';
import { CreateLogTramiteDto } from 'src/log_tramite/dto/create-log_tramite.dto';
import { LogTramiteService } from 'src/log_tramite/log_tramite.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';

@Injectable()
export class TramiteService {
  constructor(
    private prisma: PrismaService,
    private logTramiteService: LogTramiteService,
    private emailService: EmailService,
    private readonly httpService: HttpService,
  ) {}

  async create(dto: CreateTramiteDto, nome: string) {
    const { solicitacao, log_tramite, ...dtoSemSolicitacao } = dto;

    const resultado = await this.prisma.tramite.create({
      data: dtoSemSolicitacao,
    });

    const id = (await resultado).id;
    await this.salvarLogTramite(dto, nome, id);

    await this.enviarNotificacaoDoStatus(dto.status, dto.solicitacao_id, dto.cod_lotacao_destino);

    return resultado;
  }

  async enviarNotificacaoDoStatus(status: string, solicitacaoId: number, destino?: number) {
    if (process.env['ENV'] === 'DEV') return;

    const solicitacao = await this.prisma.solicitacao.findFirst({
      where: { id: solicitacaoId },
    });

    if (status === 'SOLICITADO') {
      this.enviaPresidencia(status, solicitacaoId);
      this.pesquisaDetalhesDaSolicitacao(solicitacaoId);
    }

    if (destino === 65 && status === 'APROVADO') {
      this.enviaESCOLA(status, solicitacaoId, 'Solicitação aprovada pela Presidência.');
    }

    if (status === 'APROVADO') {
      this.enviaResposta(status, solicitacaoId, solicitacao.login);
      this.enviaDARAD(status, solicitacaoId, 'Solicitação aprovada pela Presidência.');
    }

    if (status === 'VALORES_ESCOLA') {
      this.enviaDARAD(status, solicitacaoId, 'Valores informados pela Escola de Contas.');
    }

    if (status === 'CALCULADO') {
      this.enviaDAOF(status, solicitacaoId, 'Valores informados pela DARAD.');
    }

    if (status === 'EMPENHADO') {
      this.enviaDARAD(status, solicitacaoId, 'Empenho realizado pela DAOF.');
    }

    if (status === 'FINALIZADO') {
      this.enviaPresidencia(status, solicitacaoId, 'Solicitação concluída, aguardando finalização.');
    }

    if (status === 'NEGADO') {
      this.enviaResposta(status, solicitacaoId, solicitacao.login);
    }

    return null;
  }

  async enviaPresidencia(status: string, solicitacaoId: number, mensagem?: string) {
    // this.emailService.enviarEmail(solicitacaoId, status, 'wendell.sacramento', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'cons.michelhouat', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'antonio.correa', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'luzia.coelho', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'alana.castro', mensagem);
  }

  async enviaDARAD(status: string, solicitacaoId: number, mensagem?: string) {
    //this.emailService.enviarEmail(solicitacaoId, status, 'wendell.sacramento', mensagem);

    this.emailService.enviarEmail(solicitacaoId, status, 'betania.silva', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'clarisse.dias'), mensagem;
    this.emailService.enviarEmail(solicitacaoId, status, 'joanne.dias', mensagem);
  }

  async enviaDAOF(status: string, solicitacaoId: number, mensagem?: string) {
    //this.emailService.enviarEmail(solicitacaoId, status, 'wendell.sacramento', mensagem);

    this.emailService.enviarEmail(solicitacaoId, status, 'alessandra.rodrigues', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'cristiane.barbosa', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'neuma.almeida', mensagem);
    this.emailService.enviarEmail(solicitacaoId, status, 'ademir.santos', mensagem);
  }

  async enviaESCOLA(status: string, solicitacaoId: number, mensagem?: string) {
    //this.emailService.enviarEmail(solicitacaoId, status, 'wendell.sacramento', mensagem);

    this.emailService.enviarEmail(solicitacaoId, status, 'cristiane.reis', mensagem);
  }

  async enviaResposta(status: string, solicitacaoId: number, resposta: string) {
    this.emailService.enviarEmail(solicitacaoId, status, resposta);
  }

  async encaminhaSolicitacaoParaPresidenteExercicio(solicitacaoId: number) {
    const setor = '';
    const mensagem = 'Solicitação para Aprovação';
    this.emailService.enviarEmail(solicitacaoId, status, setor, mensagem);
  }

  async avisaParticipantesDoEvento(solicitacaoId: number, login: string) {
    console.log(login);

    const setor = '';
    const mensagem = 'Você foi adicionado para participar de um evento. Favor verificar detalhes da solicitação no S3i.';

    await this.emailService.enviarEmail(solicitacaoId, 'SOLICITADO', login, mensagem);
  }

  async pesquisaDetalhesDaSolicitacao(solicitadaoId: number) {
    const solicitacao = await this.prisma.solicitacao.findMany({
      where: {
        id: solicitadaoId,
      },
      include: {
        eventos: {
          include: {
            evento_participantes: {
              include: {
                participante: true,
                evento: {
                  include: {
                    evento_participantes: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    solicitacao.map((sol) => {
      sol.eventos.map((evento) => {
        evento.evento_participantes.map(async (participante) => {
          await this.pesquisaServidorGOVBR(participante.participante.cpf).then((result) => {
            this.avisaParticipantesDoEvento(solicitadaoId, result.login);
          });
        });
      });
    });

    return solicitacao;
  }

  async pesquisaServidorGOVBR(cpf: string) {
    return await this.httpService.axiosRef
      .get('https://arquivos.tce.ap.gov.br:3000/consultas/servidor-cpf?cpf=' + cpf, {
        headers: {
          Accept: '/',
          'X-API-KEY': 'PeJ22414DQr4zMR64PqQQvtKIu0yzxQi9uwh+G2E7v8=',
        },
      })
      .then((result) => result.data);
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
        solicitacao: {
          include: {
            tramite: {
              include: {
                log_tramite: true,
              },
            },
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

  findTramiteParaNoticiacao() {
    return this.prisma.tramite.findMany({
      include: {
        solicitacao: true,
      },
      where: {
        status: {
          not: 'RECUSADO',
        },
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
            correcao_solicitacao: true,
            tramite: {
              include: {
                log_tramite: true,
              },
            },
            empenho_daofi: true,
            eventos: {
              include: {
                anexo_evento: true,
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

  findOneSolicitacaoColaborador(id: number) {
    return this.prisma.solicitacao.findMany({
      where: {
        id: id,
      },
      include: {
        eventos: {
          include: {
            evento_participantes: {
              include: {
                participante: true,
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

  findTramitesDaSolicitacao(id: number) {
    return this.prisma.tramite.findMany({
      where: {
        solicitacao_id: +id,
      },
      orderBy: [{ id: 'asc' }],
      include: {
        log_tramite: {
          include: {
            tramite: true,
          },
        },
      },
    });
  }

  async listarContador(status: string, cod_lotacao_destino: number) {
    const tramites = await this.prisma.tramite.findMany({
      where: {
        AND: [
          {
            status: status,
          },
          {
            cod_lotacao_destino: +cod_lotacao_destino,
          },
        ]
      },
      include: {
        solicitacao: true,
      },
    });

    const contador = tramites.length

    return { tramites, contador };

  }

  /* async listarFinalizarDaradContador() {
    const tramites = await this.prisma.tramite.findMany({
      where: {
        AND: [
          {
            status: 'EMPENHADO',
          },
          {
            cod_lotacao_destino: 47,
          },
        ]
      },
      include: {
        solicitacao: true,
      },
    });

    const contador = tramites.length

    return { tramites, contador };
  }

  async listarGerarPDFDaradContador() {
    const tramites = await this.prisma.tramite.findMany({
      where: {
        AND: [
          {
            status: 'CONCLUIDO',
          },
          {
            cod_lotacao_destino: 47,
          },
        ]
      },
      include: {
        solicitacao: true,
      },
    });

    const contador = tramites.length

    return { tramites, contador };
  } */

  listarSolicitacoesPeloLogin(login: string) {
    return this.prisma.tramite.findMany({
      where: {
        solicitacao: {
          login: login,
        },
      },
      include: {
        solicitacao: true,
        log_tramite: true,
      },
    });
  }

  async update(id: number, dto: UpdateTramiteDto, nome?: string) {
    const { solicitacao, log_tramite, ...dtoSemSolicitacao } = dto;

    this.salvarLogTramite(dto as CreateTramiteDto, nome, id);

    await this.enviarNotificacaoDoStatus(dto.status, dto.solicitacao_id, dto.cod_lotacao_destino);

    return this.prisma.tramite.update({
      where: { id },
      data: dtoSemSolicitacao,
    });
  }

  async updateDAOFLido(id: number) {
    return this.prisma.tramite.update({
      where: { id },
      data: {
        flag_daof: 'SIM',      
      },
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


  updateStatusAoReverterTramite(id: number, dto: UpdateTramiteDto) {

    const { solicitacao, log_tramite, ...dtoSemSolicitacao } = dto;

    return this.prisma.tramite.update({
      where: { id },
      data: dtoSemSolicitacao,
    });
  }

  async remove(id: number) {
    return await this.prisma.tramite.delete({
      where: {
        id: id
      }
    })
  }
}

type ParticipanteTotalDias = {
  participante: participante;
  totalDias: number;
};
