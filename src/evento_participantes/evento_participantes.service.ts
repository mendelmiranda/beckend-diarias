import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';
import { evento, participante } from '@prisma/client';

@Injectable()
export class EventoParticipantesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateEventoParticipanteDto) {

    const prop = 'evento';
    delete dto[prop];

    return this.prisma.evento_participantes.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all eventoParticipantes`;
  }

  findOne(id: number) {
    return this.prisma.evento_participantes.findFirst({
      where: {
        id: id
      },
      include: {
        participante: true,
        evento: true,
      }
    });
  }

  findOneParticipante(id: number) {
    return this.prisma.participante.findUnique({
      where: {
        id: id
      },
    });
  }


  findParticipantesDoEvento(idEvento: number) {
    return this.prisma.evento_participantes.findMany({
      where: {
        evento_id: idEvento,
      },
      include: {
        participante: true,
      },
    });
  }

  findParticipanteDoEventoInfo(cpf: string) {
    return this.prisma.evento_participantes.findMany({
      where: {
        participante: {
          cpf: cpf,
        },
      },
      include: {
        participante: true,
        evento: {
          include: {
            solicitacao: true,
          },
        },



      },
      orderBy: [{
        evento: {
          solicitacao: {
            id: 'desc',
          }
        }
      }]
    });
  }

  async buscarParticipantesEvento(solicitacaoId: number) {
    
    try {
      
      const participantes = await this.prisma.evento.findMany({
        where: {
          solicitacao_id: +solicitacaoId,
        },
        select: {
          titulo: true,
          evento_participantes: {
            select: {
              id: true,
              participante: {
                select: {
                  nome: true,
                  id: true,
                },
              },
              viagem_participantes: {
                select: {
                  viagem: {
                    select: {
                      data_ida: true,
                      data_volta: true,
                      arcar_passagem: true,
                      custos: true,
                      data_ida_diferente: true,
                      data_volta_diferente: true,
                      deslocamento: true,
                      local_exterior: true,
                      exterior: true,
                      justificativa: true,
                      justificativa_diferente: true,
                      justificativa_municipios: true,
                      servidor_acompanhando: true,
                      viagem_diferente: true,
                      pais: true,
                      viagem_pernoite: true,
                      viagem_superior: true,

                      cidade_origem: {
                        select: {
                          descricao: true,
                          id: true,
                        },
                      },
                      cidade_destino: {
                        select: {
                          descricao: true,
                          id: true,
                        },
                      },

                      

                      origem: {
                        select: {
                          cidade: true,
                          id: true,
                        },
                      },
                      destino: {
                        select: {
                          cidade: true,
                          id: true,
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

      return participantes;
    } catch (error) {
      console.error('Erro ao buscar participantes do evento:', error);
      throw new Error('Erro ao buscar participantes do evento');
    }
  }


  update(id: number, updateEventoParticipanteDto: UpdateEventoParticipanteDto) {
    return `This action updates a #${id} eventoParticipante`;
  }

  async remove(id: number) {
    return await this.prisma.evento_participantes.delete({
      where: {
        id: id,
      },
    });
  }

  /* async remove(idEvento: number, idParticipante) {
    return await this.prisma.evento_participantes.delete({
      where: {
        evento_id_participante_id: {
          evento_id: idEvento, participante_id: idParticipante
        }
      }
    })
  } */
}
