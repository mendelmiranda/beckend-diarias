import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorViagemDto } from './dto/create-valor_viagem.dto';
import { UpdateValorViagemDto } from './dto/update-valor_viagem.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

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

  findOneValorDaViagem(id: number) {
    return this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: id
      }
    });
  }

  updateValor(viagem_id: number, updateValorViagemDto: UpdateValorViagemDto) {
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


  async updateValorViagem(viagem_id: number, updateValorViagemDto: UpdateValorViagemDto) {

    const pesquisa = await this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: viagem_id
      }
    }); 
    
    const dto: CreateValorViagemDto = {
      viagem_id: updateValorViagemDto.viagem_id,
      tipo: updateValorViagemDto.tipo,
      destino: updateValorViagemDto.destino,
      valor_individual: parseFloat(updateValorViagemDto.valor_individual+""),
      valor_grupo: updateValorViagemDto.valor_grupo,
    };      

    if(pesquisa === null){ 
      
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
        throw new Error('Falha ao atualizar os valores da viagem.'); // Propaga o erro ou manipule conforme necessário
      }
    
    }

    try {
      const resultado = await this.prisma.valor_viagem.updateMany({
        where: { viagem_id: viagem_id },
        data: dto,
      });
      return resultado; 
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.error('Erro específico do Prisma:', error.message);
      } else {
        console.error('Erro ao atualizar valor da viagem:', error.message);
      }
      throw new Error('Falha ao atualizar os valores da viagem.'); // Propaga o erro ou manipule conforme necessário
    }

  }


}
