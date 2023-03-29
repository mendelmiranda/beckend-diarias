import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorViagemDto } from './dto/create-valor_viagem.dto';
import { UpdateValorViagemDto } from './dto/update-valor_viagem.dto';

@Injectable()
export class ValorViagemService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateValorViagemDto) {   
    return this.prisma.valor_viagem.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all valorViagem`;
  }

  findValorDaViagem(id: number) {
    return this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: id
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} valorViagem`;
  }

  update(id: number, updateValorViagemDto: UpdateValorViagemDto) {
    return `This action updates a #${id} valorViagem`;
  }

  async remove(id: number) {
    return await this.prisma.valor_viagem.delete({
      where: {
        id: id
      }
    });
  }
}
