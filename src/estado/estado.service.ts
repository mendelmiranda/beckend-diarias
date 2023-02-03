import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Injectable()
export class EstadoService {
  constructor(private prisma: PrismaService) {}

  create(createEstadoDto: CreateEstadoDto) {
    return 'This action adds a new estado';
  }

  findAll() {
    return this.prisma.estado.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} estado`;
  }

  update(id: number, updateEstadoDto: UpdateEstadoDto) {
    return `This action updates a #${id} estado`;
  }

  remove(id: number) {
    return `This action removes a #${id} estado`;
  }
}
