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
  
    const viagensAgrupadas: ViagemAgrupada = {};
  
    participantes.forEach(evento => {
      evento.evento_participantes.forEach(ep => {
        ep.viagem_participantes.forEach(vp => {
          const chave = `${vp.viagem.origem?.cidade || vp.viagem.cidade_origem?.descricao}-${vp.viagem.destino?.cidade || vp.viagem.cidade_destino?.descricao}`;
          if (!viagensAgrupadas[chave]) {
            viagensAgrupadas[chave] = {
              participantes: [],
              detalhesViagem: {
                origem: vp.viagem.origem?.cidade || vp.viagem.cidade_origem?.descricao || 'Desconhecida',
                destino: vp.viagem.destino?.cidade || vp.viagem.cidade_destino?.descricao || 'Desconhecida',
              }
            };
          }
          viagensAgrupadas[chave].participantes.push({
            nome: ep.participante.nome,
            id: ep.participante.id
          });
        });
      });
    });
  
    // Aqui você pode decidir como exibir os resultados
    // Por exemplo, exibir sem mostrar a chave diretamente:
    for (const [_, group] of Object.entries(viagensAgrupadas)) {
      console.log(`Viagem de ${group.detalhesViagem.origem} para ${group.detalhesViagem.destino}`);
      group.participantes.forEach(participante => {
        console.log(`  Participante: ${participante.nome} (ID: ${participante.id})`);
      });
    }
  
    return viagensAgrupadas;
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


interface ViagemDetalhe {
  origem: string;
  destino: string;
  // incluir outros detalhes necessários da viagem
}

// Tipo para mapear viagens a participantes
export interface ViagemAgrupada {
  [key: string]: { // chave é uma string composta por origem-destino
    participantes: Array<{
      nome: string;
      id: number;
    }>;
    detalhesViagem: ViagemDetalhe;
  }
}