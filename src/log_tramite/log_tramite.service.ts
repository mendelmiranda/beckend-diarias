import { Injectable } from '@nestjs/common';
import { CreateLogTramiteDto } from './dto/create-log_tramite.dto';
import { UpdateLogTramiteDto } from './dto/update-log_tramite.dto';
import { PrismaService } from 'prisma/prisma.service';
import { tramite, solicitacao } from '@prisma/client';

@Injectable()
export class LogTramiteService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateLogTramiteDto) {
    return this.prisma.log_tramite.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.log_tramite.findMany();
  }

  findOne(id: number) {
    return this.prisma.log_tramite.findUnique({
      where: {
        id: id,
      },
    });
  }

  findLogsTramiteSolicitacao(id: number) {
    return this.prisma.log_tramite.findMany({
      where: {
        tramite: {
          solicitacao_id: id,
        },
      },
    });
  }

  findLogsTramitePorLotacao(id: number) {
    return this.prisma.log_tramite.findMany({
      where: {
        cod_lotacao_origem: id,
      },
      include: {
        tramite: {
          include: {
            solicitacao: {
              include: {
                eventos: {
                  include: {
                    tipo_evento: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findLogsTramitePorLotacaoDestino(id: number) {
    return this.prisma.log_tramite.findMany({
      where: {
        cod_lotacao_destino: id,
      },
      orderBy: [{ id: 'desc' }],
      include: {
        tramite: {
          include: {
            solicitacao: {
              include: {
                eventos: {
                  include: {
                    tipo_evento: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  update(id: number, updateLogTramiteDto: UpdateLogTramiteDto) {
    return `This action updates a #${id} logTramite`;
  }

  remove(id: number) {
    return `This action removes a #${id} logTramite`;
  }
}
