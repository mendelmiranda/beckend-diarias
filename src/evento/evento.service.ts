import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

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
