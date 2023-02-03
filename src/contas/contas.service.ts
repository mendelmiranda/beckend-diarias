import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateContaDto } from './dto/create-conta.dto';
import { UpdateContaDto } from './dto/update-conta.dto';

@Injectable()
export class ContasService {
  constructor(private prisma: PrismaService) {}

  create(createContaDto: CreateContaDto) {
    return 'This action adds a new conta';
  }

  findAll() {
    return this.prisma.contas.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} conta`;
  }

  update(id: number, updateContaDto: UpdateContaDto) {
    return `This action updates a #${id} conta`;
  }

  remove(id: number) {
    return `This action removes a #${id} conta`;
  }
}
