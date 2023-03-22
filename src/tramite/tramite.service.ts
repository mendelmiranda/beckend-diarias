import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';

@Injectable()
export class TramiteSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTramiteDto) {
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

  update(id: number, updateTramiteSolicitacaoDto: UpdateTramiteDto) {
    return this.prisma.tramite_solicitacao.update({
      where: { id },
      data: updateTramiteSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
