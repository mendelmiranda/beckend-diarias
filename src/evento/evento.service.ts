import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';

@Injectable() 
export class EventoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventoDto) {   
    return this.prisma.evento.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.evento.findMany();
  }

  findEventosDisponiveis() {
    return this.prisma.evento.findMany({
      distinct: ['titulo'],
      where: {
        inicio: {
          gte: new Date()
        }        
      },
      include: {
        tipo_evento: true,
        pais: true,
        cidade: {
          include: {
            estado: true
          }
        }
      },
      orderBy: [
        { inicio: "desc"}
       ]
    })
  }

  findEventosDaSolicitacao(idSolicitacao: number) {
    return this.prisma.evento.findMany({
      where: {
        solicitacao_id: idSolicitacao,
      },
      include: {
        evento_participantes: {
          include: {
            participante: true,
            evento: true,
          }
        },
        cidade: {
          include: {
            estado: true,
          }
        },
        pais: true,
        tipo_evento: true,
      },
      orderBy: [
       { id: "asc"}
      ]
    });
  }

  findOne(id: number) {
    return this.prisma.evento.findFirst({where: {
      id: id
    }})
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
        observacao_valor: updateEventoDto.observacao_valor ?? ''
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.evento.delete({
      where: {
        id: id
      }
    })
  }
}
