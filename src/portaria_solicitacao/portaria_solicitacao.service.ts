import { Injectable } from '@nestjs/common';
import { CreatePortariaSolicitacaoDto } from './dto/create-portaria_solicitacao.dto';
import { UpdatePortariaSolicitacaoDto } from './dto/update-portaria_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PortariaSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePortariaSolicitacaoDto) {
    return this.prisma.portaria_solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.portaria_solicitacao.findMany();
  }

  findSolicitacoesSemPortariaCadastrada() {
    return this.prisma.portaria_solicitacao.findMany({
      where: {
        OR: [
          {
            solicitacao: {
              status: 'PDF_GERADO',
            },
          },
          {
            AND: [
              {
                solicitacao: {
                  status: 'PDF_GERADO',
                },
              },
              {
                portaria: null,
              },
            ],
          },
        ],
      },
      include: {
        solicitacao: true
      }
    });
  }
  

  findOne(id: number) {
    return `This action returns a #${id} portariaSolicitacao`;
  }

  update(id: number, updatePortariaSolicitacaoDto: UpdatePortariaSolicitacaoDto) {
    return `This action updates a #${id} portariaSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} portariaSolicitacao`;
  }
}
