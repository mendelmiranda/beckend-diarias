import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';

@Injectable()
export class ViagemService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateViagemDto) {
    return this.prisma.viagem.create({
      data: dto,
    });
  }
  
  findAll() {
    return `This action returns all viagem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viagem`;
  }

  update(id: number, updateViagemDto: UpdateViagemDto) {
    return `This action updates a #${id} viagem`;
  }

  remove(id: number) {
    return `This action removes a #${id} viagem`;
  }
}
