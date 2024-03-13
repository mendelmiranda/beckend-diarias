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

  findAll( solicitacapId: number) {
    return this.prisma.solicitacao_condutores.findMany({
      where: {
        solicitacao_id: +solicitacapId
      },
      include: {
        condutores: true
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
      data: updateEventoDto,
    });
  }

  async remove(id: number) {
    return await this.prisma.solicitacao_condutores.delete({
      where: {
        id: id,
      },
    });
  }
}
