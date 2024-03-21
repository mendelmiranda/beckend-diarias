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
        viagem_id: id,
        tipo: 'PASSAGEM'
      }
    });
  }

  findValorDaDiariaColaborador(id: number) {
    return this.prisma.valor_viagem.findMany({
      where: {
        viagem_id: id,
        tipo: 'DIARIA'
      },
      orderBy: {
        id: 'desc' // Ordena pela data de criação em ordem decrescente
      }
    });
  }

  findOne(id: number) {
    return this.prisma.valor_viagem.findUnique({
      where: {
        id: id
      }
    });
  }

  update(id: number, updateValorViagemDto: UpdateValorViagemDto) {
    return this.prisma.valor_viagem.update({
      where: { id },
      data: {
        valor_individual: updateValorViagemDto.valor_individual
      },
    })
  }

  updateCotacao(id: number, cotacao: string) {
    return this.prisma.valor_viagem.update({
      where: { id },
      data: {
        cotacao_dolar: parseFloat(cotacao)
      }      
    });
  }

  async remove(id: number) {
    return await this.prisma.valor_viagem.delete({
      where: {
        id: id
      }
    });
  }
}
