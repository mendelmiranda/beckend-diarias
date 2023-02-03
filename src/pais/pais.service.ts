import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreatePaiDto } from './dto/create-pai.dto';
import { UpdatePaiDto } from './dto/update-pai.dto';

@Injectable()
export class PaisService {
  constructor(private prisma: PrismaService) {}

  create(createPaiDto: CreatePaiDto) {
    return 'This action adds a new pai';
  }

  findAll() {
    return this.prisma.pais.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} pai`;
  }

  update(id: number, updatePaiDto: UpdatePaiDto) {
    return `This action updates a #${id} pai`;
  }

  remove(id: number) {
    return `This action removes a #${id} pai`;
  }
}
