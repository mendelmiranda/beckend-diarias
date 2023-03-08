import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';
import { evento, participante } from '@prisma/client';

@Injectable()
export class EventoParticipantesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventoParticipanteDto) {
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
      }
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
