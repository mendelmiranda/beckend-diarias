import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';
import { aeroporto, cidade, evento, pais, participante, viagem } from '@prisma/client';
import { Util } from 'src/util/Util';

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
              include: {
                viagem: {
                  include: {
                    origem: true,
                    destino: true,
                    cidade_origem: true,
                    cidade_destino: true,
                    pais: true,
                  }
                }
              },
            },
          },
        },
      },
    });

    const viagensAgrupadas: { [key: string]: any } = {};

    participantes.forEach(evento => {
      evento.evento_participantes.forEach(ep => {
        ep.viagem_participantes.forEach(vp => {
          //          const chave = `${evento.titulo}-${vp.viagem.origem?.cidade || vp.viagem.cidade_origem?.descricao}-${vp.viagem.destino?.cidade || vp.viagem.cidade_destino?.descricao}`;
          const chave = `${evento.titulo}-${vp.viagem.origem?.cidade || vp.viagem.cidade_origem?.descricao}-${vp.viagem.destino?.cidade || vp.viagem.cidade_destino?.descricao}-${vp.viagem.servidor_acompanhando}
-${vp.viagem.custos}-${vp.viagem.viagem_diferente}-${vp.viagem.viagem_superior}-${vp.viagem.viagem_pernoite}`;


          if (!viagensAgrupadas[chave]) {
            viagensAgrupadas[chave] = {
              titulo: evento.titulo,
              participantes: [],
              viagem: vp.viagem,
            };
          }
          viagensAgrupadas[chave].participantes.push({
            nome: ep.participante.nome,
            id: ep.participante.id,
            servidor_acompanhando: vp.viagem.servidor_acompanhando,
            custos: vp.viagem.custos,
            viagem_diferente: vp.viagem.viagem_diferente,
            viagem_superior: vp.viagem.viagem_superior,
            viagem_pernoite: vp.viagem.viagem_pernoite,

          });
        });
      });
    });

    const listaViagens = [];
    for (const key in viagensAgrupadas) {
      const viagem = viagensAgrupadas[key];
      listaViagens.push({
        titulo: viagem.titulo,
        viagem: viagem.viagem,
        participantes: viagem.participantes,
      });
    }
    return listaViagens;
  }


  async findValoresDiarias(solicitacaoId: number) {
    try {
      const eventos = await this.prisma.evento.findMany({
        where: {
          solicitacao_id: +solicitacaoId  
        },
        select: {
          id: true,           
          titulo: true, 
          tem_passagem: true,
          inicio: true,
          fim: true,
          exterior: true,
          evento_participantes: {
            select: {
              participante: {
                select: {
                  id: true,
                  nome: true,
                  cargo: true,
                }
              },
              viagem_participantes: {
                select: {
                  viagem: {
                    select: {
                      id: true,
                      cidade_destino: {
                        include: {
                          origem: true,
                          destino: true,
                        }
                      },
                      cidade_origem: {
                        include: {
                          origem: true,
                          destino: true,
                        }
                      },
                      destino: true,
                      origem: {
                        select: {
                          cidade: true,
                          estado: true,
                        }
                      },
                      pais: true,
                      valor_viagem: {
                        select: {
                          valor_individual: true,
                          valor_grupo: true,
                          tipo: true,
                          destino: true,
                          id: true,
                          viagem_id: true,
                          justificativa: true,
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });

      //Util.totalDeDias(evento.inicio, evento.fim)+2;

      const resultadosAgrupados = eventos.map(evento => ({
        id: evento.id,
        titulo: evento.titulo,
        tem_passagem: evento.tem_passagem,
        inicio: evento.inicio,
        fim: evento.fim,  
        totalDias: Util.totalDeDias(evento.inicio, evento.fim)+1, //<=====CONFIRMAR
        exterior: evento.exterior,
        participantes: evento.evento_participantes.map(ep => ({
          participanteId: ep.participante.id,
          nomeParticipante: ep.participante.nome,
          cargo: ep.participante.cargo,
          viagens: ep.viagem_participantes.map(vp => ({
            viagem: vp.viagem,
            id: vp.viagem.id,
            valor_viagem: vp.viagem.valor_viagem,
          }))
        }))
      }));

      return resultadosAgrupados;
    } catch (error) {
     // console.error('Erro ao buscar valores das diárias:', error);
     // throw new HttpException('Erro ao processar a solicitação de valores das diárias.', HttpStatus.INTERNAL_SERVER_ERROR);
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

}



// Tipo para mapear viagens a participantes
export interface ViagemAgrupada {
  [key: string]: { // chave é uma string composta por origem-destino
    participantes: Array<{
      nome: string;
      id: number;
    }>;
    viagem: viagem;
    titulo: string;
  }
}