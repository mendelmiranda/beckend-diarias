import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';
import { evento, participante } from '@prisma/client';

@Injectable()
export class EventoParticipantesService {
  constructor(private readonly prisma: PrismaService) {}

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

  async buscarParticipantesEvento(id: number) {
    try {
      const participantes = await this.prisma.evento_participantes.findMany({
        where: {
          evento_id: +id, // Garantir que 'id' é um número
        },
        select: {
          participante: {
            select: {
              nome: true,
            },
          },
          viagem_participantes: {
            select: {
              viagem: {
                select: {
                  data_ida: true,
                  data_volta: true,
                  origem: {
                    select: {
                      id: true,
                      cidade: true,
                    },
                  },
                  destino: {
                    select: {
                      id: true,
                      cidade: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return participantes// this.agruparPorOrigemDestino(participantes);
    } catch (error) {
      console.error('Erro ao buscar participantes do evento:', error);
      throw new Error('Erro ao buscar participantes do evento');
    }
  }

  /* private agruparPorOrigemDestino(participantes: any[]) {
    try {
      return participantes.reduce((acc, item) => {
        const origem = item.viagem_participantes.viagem.origem.cidade;
        const destino = item.viagem_participantes.viagem.destino.cidade;
        const chave = `${origem}-${destino}`;
        
        if (!acc[chave]) {
          acc[chave] = [];
        }
        
        acc[chave].push({
          nome: item.participante.nome,
          origem: origem,
          destino: destino
        });

        return acc;
      }, {});
    } catch (error) {
      console.error('Erro ao agrupar participantes por origem e destino:', error);
      throw new Error('Erro ao processar os dados');
    }
  } */



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
