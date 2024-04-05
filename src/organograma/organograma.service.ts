import { Injectable } from '@nestjs/common';
import { CreateOrganogramaDto } from './dto/create-organograma.dto';
import { UpdateOrganogramaDto } from './dto/update-organograma.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class OrganogramaService {

  constructor(private prisma: PrismaService) {}
  
  async create(dto: CreateOrganogramaDto) {  
    return this.prisma.organograma.create({
      data: dto,
    });  
  }

  findAll() {
    return this.prisma.organograma.findMany({
      orderBy: [{
        pai_nome: 'asc'
      }]
    });
  }

  findOne(id: number) {
    return this.prisma.organograma.findUnique({
      where: {
        id: id
      }
    });
  }

  findOneByCodLotacao(codLotacao: number) {
    return this.prisma.organograma.findMany({
      where: {
        filho_id: +codLotacao
      }
    }).catch((error) => {
      console.log('error', error);
      
    });
  }

  update(id: number, updateOrganogramaDto: UpdateOrganogramaDto) {
    return `This action updates a #${id} organograma`;
  }

  async remove(id: number) {
    return await this.prisma.organograma.delete({
      where: {
        id: id
      }
    })
  }
}
