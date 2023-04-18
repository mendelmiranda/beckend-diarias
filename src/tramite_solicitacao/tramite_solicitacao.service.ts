import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTramiteSolicitacaoDto } from './dto/create-tramite_solicitacao.dto';
import { UpdateTramiteSolicitacaoDto } from './dto/update-tramite_solicitacao.dto';

@Injectable()
export class TramiteSolicitacaoService {
  constructor(private prisma: PrismaService) {}
  
  create(dto: CreateTramiteSolicitacaoDto) {
    return this.prisma.tramite_solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.tramite_solicitacao.findMany({
      include: {
        solicitacao: true,
        tramite: true,
      }
    })
  }

  //organizar código
  findAllTramitePeloSetor(codLotacao: number) {
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
      }
    });    
  }

  findAllTramites() {
    return this.prisma.tramite.findMany({
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
      }
    });    
  }

  findOne(id: number) {
    return `This action returns a #${id} tramiteSolicitacao`;
  }

  update(id: number, updateTramiteSolicitacaoDto: UpdateTramiteSolicitacaoDto) {
    return `This action updates a #${id} tramiteSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
