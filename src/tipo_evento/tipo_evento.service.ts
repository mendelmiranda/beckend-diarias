import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTipoEventoDto } from './dto/create-tipo_evento.dto';
import { UpdateTipoEventoDto } from './dto/update-tipo_evento.dto';

@Injectable()
export class TipoEventoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTipoEventoDto) {   
    return this.prisma.tipo_evento.create({
      data: dto,
    });
  }
  
  findAll() {
    return this.prisma.tipo_evento.findMany({
      orderBy: {descricao: "asc"},
    });
  }

  findOne(id: number) {
    return this.prisma.tipo_evento.findUnique({
      where: {id: id},
    });
  }

  update(id: number, updateTipoEventoDto: UpdateTipoEventoDto) {
    return this.prisma.tipo_evento.update({
      where: { id },
      data: updateTipoEventoDto,
    });
  }

  remove(id: number) {
    return this.prisma.tipo_evento.delete({
      where: { id: id },
    })
  }
}
