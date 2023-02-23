import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';

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
    return `This action returns a #${id} eventoParticipante`;
  }

  findParticipantesDoEvento(idEvento: number) {
    return this.prisma.evento_participantes.findMany({
      where: {
        evento_id: idEvento
      },
      include: {
        participante: true,        
      }
    })
  }

  update(id: number, updateEventoParticipanteDto: UpdateEventoParticipanteDto) {
    return `This action updates a #${id} eventoParticipante`;
  }

  remove(id: number) {
    return `This action removes a #${id} eventoParticipante`;
  }
}
