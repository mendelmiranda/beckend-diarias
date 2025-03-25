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

    try{
      return this.prisma.evento_participantes.create({
        data: {
          evento_id: dto.evento_id,
          participante_id: dto.participante_id,
        },
      });

    }catch(error){
      console.log('Erro ao criar evento_participante', error);
      throw new HttpException('Erro ao criar evento_participante', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    
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
      // Buscar eventos da solicitação
      const eventos = await this.prisma.evento.findMany({
        where: {
          solicitacao_id: +solicitacaoId,
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
                  tipo: true,
                },
              },
              viagem_participantes: {
                select: {
                  viagem: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Buscar valores consolidados de diárias diretamente de valor_viagem por participante
      const participantesIds = eventos
        .flatMap((e) => e.evento_participantes.map((ep) => ep.participante.id))
        .filter((id, index, self) => self.indexOf(id) === index); // IDs únicos

      const valoresDiarias = await this.prisma.valor_viagem.findMany({
        where: {
          participante_id: { in: participantesIds },
          tipo: 'DIÁRIA',
        },
        select: {
          participante_id: true,
          valor_individual: true,
          valor_grupo: true,
        },
      });

      // Criar um mapa de participantes com o evento que tem mais dias e o valor da diária
      const participanteEventoMap = new Map();

      eventos.forEach((evento) => {
        const totalDias = Util.totalDeDias(evento.inicio, evento.fim) + 1;

        evento.evento_participantes.forEach((ep) => {
          const participanteId = ep.participante.id;
          const valorDiariaParticipante = valoresDiarias.find(
            (v) => v.participante_id === participanteId,
          );

          // Se o participante tem um valor de diária consolidado
          let valorDiaria = 0;
          if (valorDiariaParticipante) {
            valorDiaria = valorDiariaParticipante.valor_grupo || 0; // Usa valor_grupo como consolidado
          }

          // Verificar se este evento tem mais dias que o anterior para o participante
          if (
            !participanteEventoMap.has(participanteId) ||
            participanteEventoMap.get(participanteId).dias < totalDias
          ) {
            participanteEventoMap.set(participanteId, {
              eventoId: evento.id,
              dias: totalDias,
              valorDiaria: valorDiaria,
              nome: ep.participante.nome,
            });
          }
        });
      });

      // Formatando a saída
      const resultado = eventos.map((evento) => {
        const dataInicio = new Date(evento.inicio).toLocaleDateString('pt-BR');
        const dataFim = new Date(evento.fim).toLocaleDateString('pt-BR');

        const participantesDoEvento = evento.evento_participantes.map((ep) => {
          const participanteInfo = participanteEventoMap.get(ep.participante.id);

          if (participanteInfo && participanteInfo.eventoId === evento.id) {
            return {
              nome: ep.participante.nome,
              valorDiaria:
                participanteInfo.valorDiaria > 0
                  ? `DIÁRIA ${participanteInfo.valorDiaria.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    })}`
                  : '',
            };
          } else {
            return {
              nome: ep.participante.nome,
              valorDiaria: '',
            };
          }
        });

        return {
          titulo: `${evento.titulo} DE ${dataInicio} ATÉ ${dataFim}`,
          participantes: participantesDoEvento,
        };
      });

      return resultado;
    } catch (error) {
      console.error('Erro ao buscar valores das diárias:', error);
      throw new HttpException(
        'Erro ao processar a solicitação de valores das diárias.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }n

  async listaTerceirizadosPorEventosDaSolicitacao(solicitacaoId: number) {
    const eventos = await this.prisma.evento.findMany({
      where: {
        solicitacao_id: +solicitacaoId,
      },
      include: {
        evento_participantes: {
          include: {
            viagem_participantes: {
              include: {
                viagem: {
                  select: {
                    id: true,
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
                },
              }
            },
            participante: {
              select: {
                id: true,
                nome: true,
                tipo: true,
                cpf: true,
              },
            },
          },
        },
      },
    });

    // Criando uma estrutura de dados para agrupar participantes terceirizados por evento
    return eventos.map(evento => ({
      eventoId: evento.id,  // Assumindo que você tenha um campo 'id' no objeto evento
      totalDias: Util.totalDeDias(evento.inicio, evento.fim) + 1, //<=====CONFIRMAR
      nomeEvento: evento.titulo,  // Assumindo que você tenha um campo 'nome' no objeto evento
      participantesTerceirizados: evento.evento_participantes
        .filter(ep => ep.participante.tipo === 'T')  // Filtrando apenas terceirizados
        .map(ep => ({
          participanteId: ep.participante.id,
          nome: ep.participante.nome,
          cpf: ep.participante.cpf,
          viagens: ep.viagem_participantes.map(vp => ({
            viagemId: vp.viagem.id,
            valor_viagem: vp.viagem.valor_viagem,
          }))
        })),
    }));
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