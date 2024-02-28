import { Injectable } from '@nestjs/common';
import { CreateCondutoreDto } from './dto/create-condutore.dto';
import { UpdateCondutoreDto } from './dto/update-condutore.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CondutoresService {

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCondutoreDto) {   
    return this.prisma.condutores.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.condutores.findMany();
  }

  findOne(id: number) {
    return this.prisma.condutores.findUnique({
      where: {
        id: id
      }
    })
  }

  async update(id: number, updateEventoDto: UpdateCondutoreDto) {
    return this.prisma.condutores.update({
      where: { id },
      data: updateEventoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.condutores.delete({
      where: {
        id: id
      }
    })
  }
}
