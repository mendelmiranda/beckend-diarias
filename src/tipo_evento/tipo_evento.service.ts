import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTipoEventoDto } from './dto/create-tipo_evento.dto';
import { UpdateTipoEventoDto } from './dto/update-tipo_evento.dto';

@Injectable()
export class TipoEventoService {
  constructor(private prisma: PrismaService) {}

  create(createTipoEventoDto: CreateTipoEventoDto) {
    return 'This action adds a new tipoEvento';
  }

  findAll() {
    return this.prisma.tipo_evento.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoEvento`;
  }

  update(id: number, updateTipoEventoDto: UpdateTipoEventoDto) {
    return `This action updates a #${id} tipoEvento`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoEvento`;
  }
}
