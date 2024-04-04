import { Injectable } from '@nestjs/common';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EncaminharSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEncaminharSolicitacaoDto) {
    return this.prisma.encaminhar_solicitacao.create({
      data: {
        ...dto,
        datareg: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.encaminhar_solicitacao.findMany({
      include: {
        solicitacao: true,
      },
      orderBy:[{id:'desc'}]
    });
  }

  findOne(id: number) {
    return this.prisma.encaminhar_solicitacao.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    return `This action updates a #${id} encaminharSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} encaminharSolicitacao`;
  }
}
