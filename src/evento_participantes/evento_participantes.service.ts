import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';
import { aeroporto, cidade, evento, pais, participante, viagem } from '@prisma/client';
import { Util } from 'src/util/Util';
import { differenceInDays } from 'date-fns';

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
        inicio: true,
        fim: true,
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
          inicio: true, // Incluído para calcular o total de dias
          fim: true,    // Incluído para calcular o total de dias
          evento_participantes: {
            include: {
              participante: {
                select: {
                  id: true,
                  nome: true,
                  tipo: true,
                  cpf: true,
                  cargo: true,
                  matricula: true,
                  valor_viagem: true, // Incluído para calcular o valor da diária
                },
              },
            },
          },
        },
      });
  
      // Processar os eventos para formatar a saída conforme o JSON desejado
      const resultado = eventos.map((evento) => {
        // Calcular o total de dias do evento
        const totalDias = differenceInDays(new Date(evento.fim), new Date(evento.inicio)) + 1;
  
        return {
          titulo: `${evento.titulo} DE ${this.formatDate(evento.inicio)} ATÉ ${this.formatDate(evento.fim)}`,
          totalDias: totalDias, // Adiciona o total de dias ao JSON
          participantes: evento.evento_participantes.map((ep) => {
            const valorDiaria = ep.participante.valor_viagem?.[0]?.valor_individual || "";
            const tipoDiaria = ep.participante.valor_viagem?.[0]?.tipo || "";
            const destino = ep.participante.valor_viagem?.[0]?.destino || "";
            const valorViagemId = ep.participante.valor_viagem?.[0]?.id || 0;

            return {
              id: ep.participante.id,
              nome: ep.participante.nome,
              tipo: ep.participante.tipo,
              cpf: Util.formataMascaraCpf(ep.participante.cpf),
              cargo: ep.participante.cargo,
              matricula: ep.participante.matricula,
              valorDiaria: valorDiaria ? `DIÁRIA R$ ${valorDiaria.toFixed(2).replace(".", ",")}` : "",
              tipo_diaria: tipoDiaria,
              destino: destino,
              valor_viagem_id: valorViagemId,
              source: "valor_diarias",
            };
          }),
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
  }
  
  
  // Função auxiliar para formatar datas
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

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