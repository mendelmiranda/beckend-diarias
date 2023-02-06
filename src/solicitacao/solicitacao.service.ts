import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';

@Injectable()
export class SolicitacaoService {
  constructor(private prisma: PrismaService) {}

  /* create(solicitacaoDto: CreateSolicitacaoDto) {
    
    const soli: CreateSolicitacaoDto = {
      ...solicitacaoDto,
      datareg: new Date(),
    }

    const solicitacao = this.prisma.solicitacao.create({soli});
    return solicitacao;
  } */

  async create(data: CreateSolicitacaoDto): Promise<CreateSolicitacaoDto> {
    return this.prisma.solicitacao.create({
      data,
    });
  }

  findAll() {
    return `This action returns all solicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitacao`;
  }

  update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return `This action updates a #${id} solicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
