import { Injectable } from '@nestjs/common';
import { CreateTramiteSolicitacaoDto } from './dto/create-tramite_solicitacao.dto';
import { UpdateTramiteSolicitacaoDto } from './dto/update-tramite_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TramiteSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTramiteSolicitacaoDto) {
    return this.prisma.tramite.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.tramite.findMany({
      include: {
        tramite_solicitacao: true
      },
      orderBy: {
        id: "desc"
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} tramiteSolicitacao`;
  }

  update(id: number, updateTramiteSolicitacaoDto: UpdateTramiteSolicitacaoDto) {
    return this.prisma.tramite_solicitacao.update({
      where: { id },
      data: updateTramiteSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
