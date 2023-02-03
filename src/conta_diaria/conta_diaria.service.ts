import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

@Injectable()
export class ContaDiariaService {
  constructor(private prisma: PrismaService) {}

  create(createContaDiariaDto: CreateContaDiariaDto) {
    return 'This action adds a new contaDiaria';
  }

  findAll() {
    return `This action returns all contaDiaria`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contaDiaria`;
  }

  update(id: number, updateContaDiariaDto: UpdateContaDiariaDto) {
    return `This action updates a #${id} contaDiaria`;
  }

  remove(id: number) {
    return `This action removes a #${id} contaDiaria`;
  }
}
