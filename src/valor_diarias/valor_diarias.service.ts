import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorDiariaDto } from './dto/create-valor_diaria.dto';
import { UpdateValorDiariaDto } from './dto/update-valor_diaria.dto';

@Injectable()
export class ValorDiariasService {
  constructor(private prisma: PrismaService) {}
  
  create(createValorDiariaDto: CreateValorDiariaDto) {
    return 'This action adds a new valorDiaria';
  }

  findAll() {
    return `This action returns all valorDiarias`;
  }

  findOne(id: number) {
    return `This action returns a #${id} valorDiaria`;
  }

  update(id: number, updateValorDiariaDto: UpdateValorDiariaDto) {
    return `This action updates a #${id} valorDiaria`;
  }

  remove(id: number) {
    return `This action removes a #${id} valorDiaria`;
  }
}
