import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Prisma } from '@prisma/client';
import { Evento } from './entities/evento.entity';

@Injectable()
export class EventoService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateEventoDto) {
    try {
      return await this.prisma.evento.create({
        data: dto,
      });
    } catch (error) {
      console.log(error);

      throw new Error(`Erro ao criar evento: ${error.message}`);
    }
  }


  findAll() {
    return this.prisma.evento.findMany();
  }

  findEventosDisponiveis() {
    return this.prisma.evento.findMany({
      distinct: ['titulo'],
      where: {
        inicio: {
          gte: new Date(),
        },
      },
      include: {
        tipo_evento: true,
        pais: true,
        cidade: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: [{ inicio: 'desc' }],
    });
  }

  findEventosDaSolicitacao(idSolicitacao: number) {
    return this.prisma.evento.findMany({
      where: {
        solicitacao_id: idSolicitacao,
      },
      include: {
        anexo_evento: true,
        evento_participantes: {
          include: {
            participante: true,
            evento: true,
          },
        },
        cidade: {
          include: {
            estado: true,
          },
        },
        pais: true,
        tipo_evento: true,
      },
      orderBy: [{ id: 'asc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.evento.findFirst({
      where: {
        id: id,
      },
    });
  }

  findEventosFuturos() {
    return this.prisma.evento.findMany({
      where: {
        inicio: {
          gte: new Date(),
        },
      },
      include: {
        solicitacao: {
          include: {
            tramite: {
              include: {
                log_tramite: true,
              },
            },
          }
        },
        tipo_evento: true,
        evento_participantes: {
          include: {
            participante: true,
          },
        },
        pais: true,
        cidade: {
          include: {
            estado: true,
          },
        },
      },
      orderBy: [{ inicio: 'desc' }],
    });
  }

  update(id: number, updateEventoDto: UpdateEventoDto) {
    return this.prisma.evento.update({
      where: { id },
      data: updateEventoDto,
    });
  }

  updateValores(id: number, updateEventoDto: UpdateEventoDto) {
    return this.prisma.evento.update({
      where: { id },
      data: {
        valor_evento: updateEventoDto.valor_evento,
        valor_total_inscricao: updateEventoDto.valor_total_inscricao,
        observacao_valor: updateEventoDto.observacao_valor ?? '',
      },
    });
  }

  async remove(id: number) {
    try {
      const result = await this.prisma.$executeRaw`SELECT remover_evento(${id}::INTEGER)`;
      //console.log(result);
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    } finally {
      await this.prisma.$disconnect();
    }

    /* return await this.prisma.evento.delete({
      where: {
        id: id
      }
    }) */
  }


  verificarParticipantesComViagemPorSolicitacao = async (solicitacaoId) => {
    // 1. Encontrar todos os eventos da solicitação
    const eventos = await this.prisma.evento.findMany({
      where: {
        solicitacao_id: solicitacaoId
      },
      include: {
        evento_participantes: {
          include: {
            participante: true,
            viagem_participantes: true
          }
        }
      }
    });

    // 2. Para cada evento, verificar participantes sem viagem
    const resultados = eventos.map(evento => {
      const participantesSemViagem = evento.evento_participantes.filter(
        ep => ep.viagem_participantes.length === 0
      );

      return {
        evento_id: evento.id,
        titulo: evento.titulo,
        todosTemViagem: participantesSemViagem.length === 0,
        participantesSemViagem: participantesSemViagem.map(ep => ({
          id: ep.participante_id,
          nome: ep.participante.nome,
          cpf: ep.participante.cpf
        }))
      };
    });

    return resultados;
  };


  async verificarDuplicado(params: {
    titulo: string;
    inicio: Date;
    fim: Date;
    tipo_evento_id: number;
    cidade_id?: number;
    exterior: string;
    pais_id?: number;
    local_exterior?: string;
    id_atual?: number;
    solicitacao_id: number;
  }): Promise<{ duplicado: boolean; evento?: Evento; mensagem?: string }> {
    const {
      titulo,
      inicio,
      fim,
      tipo_evento_id,
      cidade_id,
      exterior,
      pais_id,
      local_exterior,
      id_atual,
      solicitacao_id,
    } = params;

    const whereClause: Prisma.eventoWhereInput = {
      titulo,
      inicio: {
        gte: new Date(new Date(inicio).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(inicio).setHours(23, 59, 59, 999)),
      },
      fim: {
        gte: new Date(new Date(fim).setHours(0, 0, 0, 0)),
        lte: new Date(new Date(fim).setHours(23, 59, 59, 999)),
      },
      tipo_evento_id,
    };

    // Adicionar verificação de localização
    if (exterior === 'SIM') {
      whereClause.exterior = 'SIM';
      whereClause.pais_id = pais_id;

      if (local_exterior) {
        whereClause.local_exterior = local_exterior;
      }
    } else {
      whereClause.exterior = 'NAO';
      whereClause.cidade_id = cidade_id;
    }

    // Excluir o próprio evento da verificação (para updates)
    if (id_atual && id_atual > 0) {
      whereClause.id = {
        not: id_atual,
      };
    }

    const eventosExistentes = await this.prisma.evento.findMany({
      where: whereClause,
      include: {
        tipo_evento: true,
        cidade: true,
        pais: true,
      },
      take: 1,
    });

    if (eventosExistentes.length > 0) {
      return {
        duplicado: true,
        evento: eventosExistentes[0],
        mensagem: 'Já existe um evento com as mesmas características cadastrado.',
      };
    }

    return { duplicado: false };
  }

  //para o dashboard
  async getTopEventTypes() {
    const eventTypes = await this.prisma.evento.groupBy({
      by: ['tipo_evento_id'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 3
    });

    // Obter os detalhes dos tipos de evento
    const results = await Promise.all(
      eventTypes.map(async (type) => {
        const tipoEvento = await this.prisma.tipo_evento.findUnique({
          where: { id: type.tipo_evento_id }
        });

        return {
          descricao: tipoEvento.descricao,
          total: type._count.id
        };
      })
    );

    return results;
  }


  async getCidadesMaisSolicitadas() {
    try {
      const resultados = await this.prisma.$queryRaw<
        Array<{ estado: string; uf: string; total: number }>
      >(Prisma.sql`
        SELECT 
          e.descricao as estado, e.uf, COUNT(ev.id) as total
        FROM evento ev
        JOIN cidade c ON ev.cidade_id = c.id
        JOIN estado e ON c.estado_id = e.id
        WHERE ev.exterior = 'NAO'
        GROUP BY e.descricao, e.uf
        ORDER BY total DESC
        LIMIT ${Prisma.raw("5")} `);
      return resultados;
    } catch (error) {
      console.error('Erro no serviço:', error)
      console.error('Erro no serviço:', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        raw: error,
      });
      throw error;
    }
  }


}

/* async removerDadosPorSolicitacao(solicitacaoId: number) {    
  try {
    const result = await this.prisma.$executeRaw`SELECT remover_geral_darad(${solicitacaoId}::INTEGER)`;
    //console.log(result); 
  } catch (error) {
    console.error('Erro ao executar a função:', error);
  } finally {
    await this.prisma.$disconnect();
  }
} */
