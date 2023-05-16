import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { CreateLogTramiteDto } from 'src/log_tramite/dto/create-log_tramite.dto';
import { LogTramiteService } from 'src/log_tramite/log_tramite.service';


@Injectable()
export class TramiteService {
  constructor(private prisma: PrismaService, private logTramiteService: LogTramiteService) {}

  async create(dto: CreateTramiteDto, nome: string) {
    const { solicitacao, ...dtoSemSolicitacao } = dto;

    const resultado = await this.prisma.tramite.create({
      data: dtoSemSolicitacao,      
    });

    const id = (await resultado).id;
    await this.salvarLogTramite(dto, nome, id);


    return resultado;
  }

  async salvarLogTramite(dto: CreateTramiteDto, nome: string, tramiteId: number){

    const dados: CreateLogTramiteDto = {
      cod_lotacao_origem: dto.cod_lotacao_origem,
      cod_lotacao_destino: dto.cod_lotacao_destino,
      datareg: new Date(),
      nome: nome,
      lotacao_destino: dto.lotacao_destino,
      lotacao_origem: dto.lotacao_origem,
      status: dto.status,
      tramite_id: tramiteId
    }

    return await this.logTramiteService.create(dados);
  }

  findAll() {
    return this.prisma.tramite.findMany({
      include: {
        solicitacao: true
      },
      orderBy: {
        id: "desc"
      }
    })
  }

  findTramitePorLotacao(codLotacao: number){
    return this.prisma.tramite.findMany({
      where: {
        OR: [
          {cod_lotacao_destino: codLotacao},
          {cod_lotacao_origem: codLotacao}
        ]
      },
      include: {
        solicitacao: {
          include: {
            tramite: true,
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
      },
      orderBy: {
        id: "desc"
      }
    })
  }

  findTramitePresidencia(){
    return this.prisma.tramite.findMany({
      include: {
        solicitacao: {
          include: {
            tramite: true,
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
      },
      orderBy: {
        id: "desc"
      }
    })
  }

  findOne(id: number) {
    return this.prisma.tramite.findFirst({
      where: {
        id: +id
      }
    })
  }

  findOneSolicitacao(id: number) {
    return this.prisma.tramite.findFirst({
      where: {
        solicitacao_id: +id
      },
      include: {
        log_tramite: true,
        solicitacao: {
          include: {
            eventos: {
              include: {
                tipo_evento: true
              }
            }
          }
        }
      }
    })
  }

  update(id: number, dto: UpdateTramiteDto, nome?: string) {
    const { solicitacao, ...dtoSemSolicitacao } = dto;

    this.salvarLogTramite(dto as CreateTramiteDto, nome, id);

    return this.prisma.tramite.update({
      where: { id },
      data: dtoSemSolicitacao,
    });
  }

  updateStatus(id: number, status: string, nome: string, dto: CreateTramiteDto) {    
    /* const data = this.prisma.tramite.findUnique({
      where: {
        id: id,
      }
    }).then((dto) => { */
      
      const dados: CreateLogTramiteDto = {
        cod_lotacao_origem: dto.cod_lotacao_origem,
        cod_lotacao_destino: dto.cod_lotacao_destino,
        datareg: new Date(),
        nome: nome,
        lotacao_destino: dto.lotacao_destino,
        lotacao_origem: dto.lotacao_origem,
        status: status,
        tramite_id: id
      }

      this.salvarLogTramite(dto, nome, id);

    //});


    return this.prisma.tramite.update({
      where: { id },
      data: {
        status: status.toUpperCase()
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
