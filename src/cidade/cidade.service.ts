import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';

@Injectable()
export class CidadeService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateCidadeDto) {
    return this.prisma.cidade.create({
      data,
    });
  }

  findAll() {
    return this.prisma.cidade.findMany({
      orderBy: {descricao: 'asc'}
    });
  }

  findOne(id: number) {
    return this.prisma.cidade.findFirst({
      where: {
        id: id
      }, 
      include: {
        estado: true,
      }
    });
  }

  update(id: number, updateCidadeDto: UpdateCidadeDto) {
    return `This action updates a #${id} cidade`;
  }

  remove(id: number) {
    return `This action delete a #${id} cidade`;
    /* return this.prisma.cidade.delete({
      where: { id: id },
    }) */
  }


  async localizaCidadesPorEstadoId(id: number) {
    return this.prisma.cidade.findMany({
      where: {
        estado_id: id
      }, 
      include: {
        estado: true,
      }
    });
  }


  

}
