import { Injectable } from '@nestjs/common';
import { CreateSolicitacaoCondutoreDto } from './dto/create-solicitacao_condutore.dto';
import { UpdateSolicitacaoCondutoreDto } from './dto/update-solicitacao_condutore.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class SolicitacaoCondutoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSolicitacaoCondutoreDto) {
    return this.prisma.solicitacao_condutores.create({
      data: dto,
    });
  }

  findAll(solicitacapId: number) {
    return this.prisma.solicitacao_condutores.findMany({
      where: {
        solicitacao_id: +solicitacapId
      },
      include: {
        condutores: true,
        diaria_condutor: true
      }
    });
  }

  findOne(id: number) {
    return this.prisma.condutores.findUnique({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateEventoDto: UpdateSolicitacaoCondutoreDto) {    
    return this.prisma.solicitacao_condutores.update({
      where: { id },
      data: {
        veiculo: updateEventoDto.veiculo,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.solicitacao_condutores.delete({
      where: {
        id: id,
      },
    });
  }

  
  async createCondutorServidor(
    cpf: string,
    nome: string,
    dto: CreateSolicitacaoCondutoreDto,
  ) {
    try {
      const condutor = await this.findOrCreateCondutor(cpf, nome);
  
      // Verifica se já existe a associação condutor <-> solicitacao
      const solicitacaoCondutorExistente = await this.prisma.solicitacao_condutores.findFirst({
        where: {
          condutores_id: condutor.id,
          solicitacao_id: dto.solicitacao_id,
        },
      });
  
      if (solicitacaoCondutorExistente) {
        // Já existe, retorna a associação existente (ou lance erro, conforme regra de negócio)
        return solicitacaoCondutorExistente;
      }
  
      // Caso não exista, cria a associação
      return await this.prisma.solicitacao_condutores.create({
        data: {
          condutores_id: condutor.id,
          solicitacao_id: dto.solicitacao_id,
          veiculo: dto.veiculo,
        },
      });
    } catch (error) {
      console.error('Erro ao criar condutor ou solicitação:', error);
      throw error;
    }
  }
  
  private async findOrCreateCondutor(cpf: string, nome: string) {
    let condutor = await this.prisma.condutores.findFirst({ where: { cpf } });
  
    if (!condutor) {
      condutor = await this.prisma.condutores.create({
        data: { cpf, nome, tipo: 'S', validade_cnh: new Date()},
      });
    }
  
    return condutor;
  }
}
