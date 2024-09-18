import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
    const pesquisa = await this.prisma.solicitacao_condutores.findMany({
      where: {
        condutores_id: id,
      },
    });
  
    if (pesquisa.length > 0) {
      throw new HttpException(
        'Não é possível excluir este condutor, pois ele está vinculado a uma solicitação de viagem.',
        HttpStatus.CONFLICT, // 409 Conflict
      );
    }
  
    return await this.prisma.condutores.delete({
      where: {
        id: id,
      },
    });
  }
  
}
