import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateViagemEventoDto } from './dto/create-viagem_evento.dto';
import { UpdateViagemEventoDto } from './dto/update-viagem_evento.dto';

@Injectable()
export class ViagemEventoService {

  constructor(
    private prisma: PrismaService,) { }


    async create(createViagemEventoDto: CreateViagemEventoDto) {
      
      return this.prisma.viagem_evento.create({ data: createViagemEventoDto });
    }

  findAll() {
    return `This action returns all viagemEvento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viagemEvento`;
  }

  update(id: number, updateViagemEventoDto: UpdateViagemEventoDto) {
    return `This action updates a #${id} viagemEvento`;
  }

  remove(id: number) {
    return `This action removes a #${id} viagemEvento`;
  }
}
