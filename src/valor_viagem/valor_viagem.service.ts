import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorViagemDto } from './dto/create-valor_viagem.dto';
import { UpdateValorViagemDto } from './dto/update-valor_viagem.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class ValorViagemService {
  constructor(private readonly prisma: PrismaService) { }

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
  async update(id: number, updateValorViagemDto: UpdateValorViagemDto) {
    
    try {
      // Converter a string para número
      const valorIndividual = parseFloat(updateValorViagemDto.valor_individual.toString());
      
      // Verificar se a conversão resultou em um número válido
      if (isNaN(valorIndividual)) {
        throw new Error('Valor individual inválido: não é um número válido');
      }
      
      const result = await this.prisma.valor_viagem.update({
        where: { id },
        data: {
          valor_individual: valorIndividual // Agora usando o valor numérico
        },
      });
      return result;
    } catch (error) {
      console.error('Erro detalhado no Prisma:', error);
      throw error;
    }
  }

  updateCotacao(id: number, cotacao: string) {
    return this.prisma.valor_viagem.update({
      where: { id },
      data: {
        cotacao_dolar: parseFloat(cotacao)
      }
    });
  }

  async findOneValorDaViagem(id: number) {
    return this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: id
      }
    });
  }

  async updateValor(viagem_id: number, updateValorViagemDto: UpdateValorViagemDto) {
    return this.prisma.valor_viagem.updateMany({
      where: { viagem_id: viagem_id },
      data: updateValorViagemDto,
    })
  }

  async remove(id: number) {
    return await this.prisma.valor_viagem.delete({
      where: {
        id: id
      }
    });
  }


  async updateValorViagemTipo(viagem_id: number, tipo: string, updateValorViagemDto: UpdateValorViagemDto) {
    const pesquisa = await this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: viagem_id,
        tipo: tipo
      }
    });
  
    const dto: CreateValorViagemDto = {
      viagem_id: updateValorViagemDto.viagem_id,
      tipo: updateValorViagemDto.tipo,
      destino: updateValorViagemDto.destino,
      valor_individual: parseFloat(updateValorViagemDto.valor_individual + ""),
      valor_grupo: updateValorViagemDto.valor_grupo,
    };
  
    if (pesquisa === null) {
      try {
        await this.prisma.valor_viagem.create({
          data: dto,
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          console.error('Erro específico do Prisma:', error.message);
        } else {
          console.error('Erro ao criar valor da viagem:', error.message);
        }
        throw new Error('Falha ao atualizar os valores da viagem.');
      }
    } else {
      try {
        const resultado = await this.prisma.valor_viagem.updateMany({
          where: {
            viagem_id: viagem_id,
            tipo: tipo
          },
          data: dto,
        });
        return resultado;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          console.error('Erro específico do Prisma:', error.message);
        } else {
          console.error('Erro ao atualizar valor da viagem:', error.message);
        }
        throw new Error('Falha ao atualizar os valores da viagem.');
      }
    }
  }
  


}