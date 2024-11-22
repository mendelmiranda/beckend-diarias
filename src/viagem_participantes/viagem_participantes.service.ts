import { Injectable } from '@nestjs/common';
import { CreateViagemParticipanteDto } from './dto/create-viagem_participante.dto';
import { UpdateViagemParticipanteDto } from './dto/update-viagem_participante.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ViagemParticipantesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateViagemParticipanteDto) {
    
    return this.prisma.viagem_participantes.create({
        data: {
            evento_participantes: {
                connect: {
                    id: dto.evento_participantes_id
                }
            },
            viagem: {
                connect: {
                    id: dto.viagem_id
                }
            },
            datareg: new Date(),
            servidor_acompanhando: dto.servidor_acompanhando ?? '',
            viagem_diferente: dto.viagem_diferente ?? '',
            justificativa_diferente: dto.justificativa_diferente ?? '',
            data_ida_diferente: dto.data_ida_diferente ?? undefined,
            data_volta_diferente: dto.data_volta_diferente ?? undefined,
            arcar_passagem: dto.arcar_passagem ?? '',
            custos: dto.custos ?? [],
            justificativa_custos: dto.justificativa_custos ?? ''            
        }
    });
  }

  findAll() {
    return `This action returns all viagemParticipantes`;
  }

  findParticipantesViagemDoEvento(idEvento: number) {
    return this.prisma.viagem_participantes.findMany({
      where: {
        evento_participantes: {
          evento: { id: idEvento },
        },
      },

      include: {
        viagem: {
          include: {
            origem: true,
            destino: true,
            cidade_origem: true,
            cidade_destino: true,
            pais: true,
          },
        },

        evento_participantes: {
          include: { participante: true },
        },
      },
    });
  }

  findParticipanteDaViagem(id: number){
    return this.prisma.viagem_participantes.findFirst(
      {
        where: {
          viagem_id: id
        },
        include: {
          evento_participantes: {
            include: {
              participante: true,
            }
          }
        }
      }
    )
  }

  findOne(id: number) {
    return this.prisma.viagem_participantes.findFirst({
      where: {
        id: id
      }
    })
  }

  findViagemDoParticipantePeloId(id: number) {
    return this.prisma.viagem_participantes.findFirst({
      where: {
        evento_participantes_id: id
      },
      include: {
        viagem: {
          include: {
            origem: true,
            destino: true,
            cidade_origem: true,
            cidade_destino: true,
            pais: true,
          },
        },

      }
    })
  }

  findParticipantesDaViagemPorId(viagemId: number) {
    return this.prisma.viagem_participantes.findMany({
      where: {
        viagem_id: viagemId
      },
      include: {
        evento_participantes: {
          include: {
            participante: true,
          }
        }
      }
    })
  }


  update(id: number, updateViagemParticipanteDto: UpdateViagemParticipanteDto) {
    
    return this.prisma.viagem_participantes.update(
      {
        where: {
          id: id
        },
        data: {
          servidor_acompanhando: updateViagemParticipanteDto.servidor_acompanhando,
          viagem_diferente: updateViagemParticipanteDto.viagem_diferente,
          justificativa_diferente: updateViagemParticipanteDto.justificativa_diferente,
          data_ida_diferente: updateViagemParticipanteDto.data_ida_diferente,
          data_volta_diferente: updateViagemParticipanteDto.data_volta_diferente,
          arcar_passagem: updateViagemParticipanteDto.arcar_passagem,
          custos: updateViagemParticipanteDto.custos,
          justificativa_custos: updateViagemParticipanteDto.justificativa_custos
        }
      }
    );
  }

  async remove(id: number) {
    const consultar = await this.findOne(id);

    if(consultar){
      const viagemId = consultar.viagem_id;      

      const valorViagem = await this.prisma.valor_viagem.findFirst({
        where: {
          viagem_id: viagemId
        }
      });

      if(valorViagem !== null){
        await this.prisma.valor_viagem.delete({
          where: {
            id: valorViagem.id
          }
        });
      }      
     
    }

    return await this.prisma.viagem_participantes.delete({
      where: {
        id: id,
      },
    });
  }
}
