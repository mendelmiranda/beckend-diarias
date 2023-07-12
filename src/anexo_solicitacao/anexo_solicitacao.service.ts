import { Injectable } from '@nestjs/common';
import { CreateAnexoSolicitacaoDto } from './dto/create-anexo_solicitacao.dto';
import { UpdateAnexoSolicitacaoDto } from './dto/update-anexo_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AnexoSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAnexoSolicitacaoDto) {
    return this.prisma.anexo_solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all anexoSolicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} anexoSolicitacao`;
  }

  update(id: number, updateAnexoSolicitacaoDto: UpdateAnexoSolicitacaoDto) {
    return `This action updates a #${id} anexoSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} anexoSolicitacao`;
  }
}
