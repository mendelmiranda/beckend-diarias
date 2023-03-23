import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { CreateTramiteSolicitacaoDto } from '../tramite_solicitacao/dto/create-tramite_solicitacao.dto';
import { TramiteSolicitacaoService } from 'src/tramite_solicitacao/tramite_solicitacao.service';


@Injectable()
export class TramiteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTramiteDto) {

    const prop = 'solicitacao';
    delete dto[prop];    

    const resultado = this.prisma.tramite.create({
      data: dto,
    });

    return resultado;
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

  findTramitePorLotacao(codLotacao: number){
    return this.prisma.tramite.findMany({
      where: {
        cod_lotacao: codLotacao
      },
      include: {
        tramite_solicitacao: {
          include: {
            solicitacao: {
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
            },

          }
        }
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
    return this.prisma.tramite.update({
      where: { id },
      data: updateTramiteSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
