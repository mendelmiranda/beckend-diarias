import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { conta_diaria } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { ContaDiariaService } from 'src/conta_diaria/conta_diaria.service';
import {
  ContaDiariaInput,
  variantesCpf,
} from 'src/conta_diaria/conta-diaria.helpers';
import { CreateParticipanteDto } from '../participante/dto/create-participante.dto';
import { UpdateParticipanteDto } from '../participante/dto/update-participante.dto';

@Injectable()
export class ParticipanteService {
  constructor(
    private prisma: PrismaService,
    private readonly contaDiariaService: ContaDiariaService,
  ) { }

  /**
   * Persiste participante e conta bancária (`conta_diaria[]` ou `contaDiariaModel`).
   * Retorna sempre o id do participante.
   */
  async create(dto: CreateParticipanteDto): Promise<number> {
    const contaPayload = this.extrairContaDoDto(dto);
    const data = { ...dto };
    this.limparCamposContaDoDto(data as unknown as Record<string, unknown>);

    if (data.data_nascimento && typeof data.data_nascimento === 'string') {
      data.data_nascimento = new Date(data.data_nascimento);
    }

    let participanteId: number;

    if (data.tipo === 'C' || data.tipo === 'T') {
      participanteId = await this.persistirParticipanteColaborador(data);
    } else {
      const participante = await this.prisma.participante.create({
        data: this.toParticipanteCreateData(data),
      });
      participanteId = participante.id;
    }

    if (contaPayload) {
      await this.contaDiariaService.upsertForParticipante(
        participanteId,
        contaPayload,
        { nome: data.nome, cpf: data.cpf, tipo: data.tipo },
      );
    }

    return participanteId;
  }

  /** @deprecated Use create() — mantido para compatibilidade. */
  async cadastraColaborador(dto: CreateParticipanteDto): Promise<number> {
    return this.create(dto);
  }

  private async persistirParticipanteColaborador(
    dto: CreateParticipanteDto,
  ): Promise<number> {
    if (!dto.cpf) {
      const participante = await this.prisma.participante.create({
        data: this.toParticipanteCreateData(dto),
      });
      return participante.id;
    }

    const cpfVariants = variantesCpf(dto.cpf);
    const participanteExistente = await this.prisma.participante.findFirst({
      where:
        cpfVariants.length > 0
          ? { cpf: { in: cpfVariants } }
          : { cpf: dto.cpf },
      orderBy: { id: 'desc' },
    });

    if (participanteExistente) {
      await this.prisma.participante.update({
        where: { id: participanteExistente.id },
        data: this.toParticipanteCreateData(
          dto,
        ) as Prisma.participanteUpdateInput,
      });
      return participanteExistente.id;
    }

    const participante = await this.prisma.participante.create({
      data: this.toParticipanteCreateData(dto),
    });
    return participante.id;
  }

  extrairContaDoDto(dto: {
    contaDiariaModel?: conta_diaria;
    conta_diaria?: conta_diaria[];
  }): ContaDiariaInput | undefined {
    if (dto.contaDiariaModel) {
      return dto.contaDiariaModel;
    }
    if (Array.isArray(dto.conta_diaria) && dto.conta_diaria.length > 0) {
      return dto.conta_diaria[0];
    }
    return undefined;
  }

  limparCamposContaDoDto(dto: Record<string, unknown>): void {
    delete dto.contaDiariaModel;
    delete dto.conta_diaria;
  }

  async salvarOuAtualizarContaDiaria(
    participanteId: number,
    conta: ContaDiariaInput,
    defaults?: { nome?: string; cpf?: string; tipo?: string },
  ) {
    return this.contaDiariaService.upsertForParticipante(
      participanteId,
      conta,
      defaults,
    );
  }

  private toParticipanteCreateData(
    dto: CreateParticipanteDto,
  ): Prisma.participanteCreateInput {
    const copy = { ...dto } as Record<string, unknown>;
    this.limparCamposContaDoDto(copy);
    return copy as Prisma.participanteCreateInput;
  }

  private toParticipanteUpdateData(
    dto: UpdateParticipanteDto,
  ): Prisma.participanteUpdateInput {
    const { id: _id, ...rest } = dto;
    const copy = { ...rest } as Record<string, unknown>;
    this.limparCamposContaDoDto(copy);
    return copy as Prisma.participanteUpdateInput;
  }

  findAll() {
    return `This action returns all participante`;
  }

  async pesquisarParticipantePorCpf(cpf: string) {    
    const resultado = await this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
        tipo: { not: 'S' },
      },
      include: {
        cidade: true,
        conta_diaria: {
          include: {
            banco: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });
    
    if (!resultado) {
      throw new NotFoundException({
        message: `Participante não encontrado`,
        error: 'Not Found',
        statusCode: 404,
        details: {
          cpf: cpf,
          timestamp: new Date().toISOString()
        }
      });
    }

    return resultado;
  }

  pesquisarParticipanteServidorPorCpf(cpf: string) {
    return this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
        tipo: { not: 'T' },
      },
      include: {
        cidade: true,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.participante.findFirst({
      where: {
        id: id,
      }
    })
  }

  async update(id: number, updateParticipanteDto: UpdateParticipanteDto) {
    const contaPayload = this.extrairContaDoDto(updateParticipanteDto);
    const data = { ...updateParticipanteDto };
    this.limparCamposContaDoDto(data as unknown as Record<string, unknown>);

    if (
      data.data_nascimento &&
      typeof data.data_nascimento === 'string'
    ) {
      data.data_nascimento = new Date(data.data_nascimento);
    }

    const participante = await this.prisma.participante.update({
      where: { id },
      data: this.toParticipanteUpdateData(data),
    });

    if (contaPayload) {
      await this.contaDiariaService.upsertForParticipante(
        id,
        contaPayload,
        {
          nome: data.nome ?? participante.nome,
          cpf: data.cpf ?? participante.cpf,
          tipo: data.tipo ?? participante.tipo,
        },
      );
    }

    return participante;
  }

  remove(id: number) {
    return `This action removes a #${id} participante`;
  }

  async createS3i(dto: CreateParticipanteDto) {
    try {
      const existeParticipante = await this.prisma.participante.findFirst({
        where: {
          cpf: dto.cpf,
        },
        select: {
          id: true, // Seleciona apenas o ID
        }
      });

      if (existeParticipante) {
        return existeParticipante.id; // Retorna apenas o ID
      } else {
        const participante = await this.prisma.participante.create({
          data: this.toParticipanteCreateData(dto),
          select: {
            id: true, // Seleciona apenas o ID
          }
        });        

        return participante.id; // Retorna apenas o ID
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Erro de duplicidade de dados.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Erro ao criar participante', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  private isEquivalent(dto: CreateParticipanteDto, existeParticipante: any): boolean {
    const relevantFields = ['lotacao', 'cargo', 'classe'];

    return relevantFields.every(field => dto[field] === existeParticipante[field]);
  }

  async listarEventosComTodasViagens(solicitacaoId: number) {
    // Buscar todos os eventos da solicitação
    const eventos = await this.prisma.evento.findMany({
      where: {
        solicitacao_id: solicitacaoId,
      },
      include: {
        // Incluir participantes do evento
        evento_participantes: {
          include: {
            participante: true,
            // Incluir todas as viagens associadas a cada participante
            viagem_participantes: {
              include: {
                viagem: {
                  include: {
                    origem: true,
                    destino: true,
                    cidade_origem: true,
                    cidade_destino: true,
                  }
                }
              }
            }
          },
        },
        // Incluir todas as viagens associadas ao evento
        viagem_evento: {
          include: {
            viagem: {
              include: {
                origem: true,
                destino: true,
                cidade_origem: true,
                cidade_destino: true,
                // Incluir a relação com participantes dessa viagem
                viagem_participantes: {
                  include: {
                    evento_participantes: {
                      include: {
                        participante: true,
                      }
                    }
                  }
                }
              }
            }
          },
        },
      },
    });
  
    // Formatar os eventos com todas as viagens e participantes
    return eventos.map(evento => {
      // Obter todas as viagens associadas ao evento
      const viagens = evento.viagem_evento.map(ve => ve.viagem);
  
      // Mapear participantes do evento
      const participantesDoEvento = evento.evento_participantes.map(ep => ({
        id: ep.participante.id,
        nome: ep.participante.nome,
        cpf: ep.participante.cpf,
        tipo: ep.participante.tipo,
        matricula: ep.participante.matricula,
        // Associar as viagens específicas deste participante
        viagens: ep.viagem_participantes.map(vp => ({
          id: vp.viagem.id,
          data_ida: vp.viagem.data_ida,
          data_volta: vp.viagem.data_volta,
          origem: vp.viagem.origem_id && vp.viagem.origem ? vp.viagem.origem.cidade : 
                  vp.viagem.cidade_origem_id && vp.viagem.cidade_origem ? vp.viagem.cidade_origem.descricao : 'Não especificado',
          destino: vp.viagem.destino_id && vp.viagem.destino ? vp.viagem.destino.cidade : 
                   vp.viagem.cidade_destino_id && vp.viagem.cidade_destino ? vp.viagem.cidade_destino.descricao : 'Não especificado',
          valor_passagem: vp.viagem.valor_passagem,
          destino_uf: vp.viagem.destino_id && vp.viagem.destino ? vp.viagem.destino.uf : 'Não especificado',
          origem_uf: vp.viagem.origem_id && vp.viagem.origem ? vp.viagem.origem.uf : 'Não especificado',
        }))
      }));
  
      return {
        id: evento.id,
        titulo: evento.titulo,
        inicio: evento.inicio,
        fim: evento.fim,
        participantes: participantesDoEvento,
        // Incluir todas as viagens do evento
        viagens: viagens.map(viagem => ({
          id: viagem.id,
          data_ida: viagem.data_ida,
          data_volta: viagem.data_volta,
          origem: viagem.origem_id && viagem.origem ? viagem.origem.cidade : 
                  viagem.cidade_origem_id && viagem.cidade_origem ? viagem.cidade_origem.descricao : 'Não especificado',
          destino: viagem.destino_id && viagem.destino ? viagem.destino.cidade : 
                   viagem.cidade_destino_id && viagem.cidade_destino ? viagem.cidade_destino.descricao : 'Não especificado',
          destino_uf: viagem.destino_id && viagem.destino ? viagem.destino.uf : 'Não especificado',                   
          origem_uf: viagem.origem_id && viagem.origem ? viagem.origem.uf : 'Não especificado',
          valor_passagem: viagem.valor_passagem,
          participantes: viagem.viagem_participantes.map(vp => ({
            id: vp.evento_participantes.participante.id,
            nome: vp.evento_participantes.participante.nome,
            cpf: vp.evento_participantes.participante.cpf,
            tipo: vp.evento_participantes.participante.tipo,
            matricula: vp.evento_participantes.participante.matricula,
          }))
        }))
      };
    });
  }


  async findParticipantesEmEventosAtuais() {
    const today = new Date();
    
    // Formatando a data para evitar problemas com timezone
    today.setHours(0, 0, 0, 0);
    
    return this.prisma.participante.findMany({
      select: {
        id: true,
        nome: true,
        matricula: true,
        lotacao: true,
        evento_participantes: {
          select: {
            evento: {
              select: {
                id: true,
                titulo: true,
                inicio: true,
                fim: true,
                exterior: true,
                local_exterior: true,
                informacoes: true,
                tem_passagem: true,
                solicitacao: {
                  select: {
                    id: true,
                    status: true,
                  },
                },
              },
            },
          },
          where: {
            evento: {
              inicio: {
                lte: today,
              },
              fim: {
                gte: today,
              },
              solicitacao: {
                status: 'PDF_GERADO',
              },
            },
          },
        },
      },
      where: {
        evento_participantes: {
          some: {
            evento: {
              inicio: {
                lte: today,
              },
              fim: {
                gte: today,
              },
              solicitacao: {
                status: 'PDF_GERADO',
              },
            },
          },
        },
      },
      orderBy: {
        nome: 'asc',
      },
    });
  }



}
