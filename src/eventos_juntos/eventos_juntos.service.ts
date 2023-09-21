import { Injectable } from '@nestjs/common';
import { CreateEventosJuntoDto } from './dto/create-eventos_junto.dto';
import { UpdateEventosJuntoDto } from './dto/update-eventos_junto.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EventosJuntosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventosJuntoDto): Promise<CreateEventosJuntoDto> {

    if (dto.solicitacao_id > 0 && dto.evento_id > 0) {
      const consulta = await this.findOne(dto.solicitacao_id, dto.evento_id);      

      if (consulta !== null) {
        this.remove(consulta.id);
        return this.prisma.eventos_juntos.create({
          data: dto,
        });
      } else {
        return this.prisma.eventos_juntos.create({
          data: dto,
        });
      }
    }

    return null;
  }

  findAllBySolicitacaoId(solicitacao_id: number) {
    return this.prisma.eventos_juntos.findMany({
      where: {
        solicitacao_id: solicitacao_id,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findOne(solicitacaoId: number, eventoId: number) {
    return this.prisma.eventos_juntos.findFirst({
      where: {
        evento_id: eventoId,
        solicitacao_id: solicitacaoId,
      },
    });
  }

  update(id: number, updateEventosJuntoDto: UpdateEventosJuntoDto) {
    return `This action updates a #${id} eventosJunto`;
  }

  async remove(id: number) {
    return await this.prisma.eventos_juntos.delete({
      where: {
        id: id,
      },
    });
  }
}
