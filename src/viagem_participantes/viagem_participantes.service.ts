import { Injectable } from '@nestjs/common';
import { CreateViagemParticipanteDto } from './dto/create-viagem_participante.dto';
import { UpdateViagemParticipanteDto } from './dto/update-viagem_participante.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ViagemParticipantesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateViagemParticipanteDto) {
    return this.prisma.viagem_participantes.create({
      data: dto,
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
    return `This action returns a #${id} viagemParticipante`;
  }

  update(id: number, updateViagemParticipanteDto: UpdateViagemParticipanteDto) {
    return `This action updates a #${id} viagemParticipante`;
  }

  async remove(id: number) {
    return await this.prisma.viagem_participantes.delete({
      where: {
        id: id,
      },
    });
  }
}
