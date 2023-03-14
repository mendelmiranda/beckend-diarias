import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';

@Injectable()
export class SolicitacaoService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSolicitacaoDto): Promise<CreateSolicitacaoDto> {
    return this.prisma.solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.solicitacao.findMany({
      orderBy: [
        {id: 'desc'}
      ]
    });
  }

  findOne(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      }
    })
  }

  detalhesDaSolicitacao(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      },
      include: {
        eventos: {
          include: {
            evento_participantes: {
              include: {
                participante: true,
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        cidade_origem: true,
                        cidade_destino: true,
                      }
                    }
                  }
                }
              }
            },
            tipo_evento: true,
            cidade: {
              include:{
                estado: true,
              }
            },
            pais: true,
          }
        }
      }
    })
  }

  update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return this.prisma.solicitacao.update({
      where: { id },
      data: updateSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacao`;
  }
}
