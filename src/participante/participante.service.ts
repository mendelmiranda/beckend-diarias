import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { conta_diaria } from '@prisma/client';
import { CreateContaDiariaDto } from 'src/conta_diaria/dto/create-conta_diaria.dto';

@Injectable()
export class ParticipanteService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateParticipanteDto) {   

    if (dto.tipo === "C" || dto.tipo === "T") {
      return this.cadastraColaborador(dto);
    }

    return this.prisma.participante.create({
      data: dto,
    });
  }

  async cadastraColaborador(dto: CreateParticipanteDto) {

    const remove = 'conta_diaria';
    const prop = 'conta_diaria';
    const contaX: conta_diaria = dto[prop][0];

    delete dto[remove];

    const participante = await this.prisma.participante.create({
      data: dto,
    });
    
    const participanteId = participante.id;

    const modeloConta: CreateContaDiariaDto = {
      ...contaX,
      participante_id: participanteId,
    }

    if(modeloConta.id > 0){
      await this.prisma.conta_diaria.update({
        where: { id: modeloConta.id },
        data: modeloConta,
      });
    } else {
      await this.prisma.conta_diaria.create({
        data: modeloConta,
      });
    }

    return participanteId;

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

  update(id: number, updateParticipanteDto: UpdateParticipanteDto) {
    return this.prisma.participante.update({
      where: { id },
      data: updateParticipanteDto,
    });
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
          data: dto,
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
