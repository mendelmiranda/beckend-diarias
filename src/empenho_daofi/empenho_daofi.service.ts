import { Injectable } from '@nestjs/common';
import { CreateEmpenhoDaofiDto } from './dto/create-empenho_daofi.dto';
import { UpdateEmpenhoDaofiDto } from './dto/update-empenho_daofi.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EmpenhoDaofiService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateEmpenhoDaofiDto) {

    const dados: CreateEmpenhoDaofiDto = {
      ...dto,
      datareg: new Date(),
    }

    return this.prisma.empenho_daofi.create({
      data: dados,
    });
  }

  findAll() {
    return this.prisma.empenho_daofi.findMany();
  }

  findOne(id: number) {
    return this.prisma.empenho_daofi.findUnique({
      where: {
        id: id
      }
    })
  }

  findEmpenhoPorSolicitacaoId(id: number) {
    return this.prisma.empenho_daofi.findMany({
      where: {
        solicitacao_id: id
      },
    })
  }

  update(id: number, updateEmpenhoDaofiDto: UpdateEmpenhoDaofiDto) {
    return `This action updates a #${id} empenhoDaofi`;
  }

  async remove(id: number) {
    return await this.prisma.empenho_daofi.delete({
      where: {
        id: id
      }
    })
  }

  async findInfoValoresParaEmpenhoPorSolicitacaoId(solicitacaoId: number) {
    const eventos = await this.prisma.evento.findMany({
        where: {
            solicitacao_id: solicitacaoId
        },
        select: {
            id: true,
            titulo: true,
            evento_participantes: {
                include: {
                    participante: {
                        select: {
                            id: true,
                            nome: true,
                            tipo: true
                        }
                    },
                    viagem_participantes: {
                        include: {
                            viagem: {
                                select: {
                                    id: true,
                                    valor_viagem: {
                                        select: {
                                            valor_individual: true,
                                            tipo: true,
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Calculando o total dos valores individuais para cada evento
    const eventosComTotal = eventos.map(evento => ({
        ...evento,
        totalValorIndividual: evento.evento_participantes.reduce((acc, ep) => {
            const totalPorParticipante = ep.viagem_participantes.reduce((accVP, vp) => {
                const totalPorViagem = vp.viagem.valor_viagem.reduce((accVV, vv) => accVV + (vv.valor_individual ?? 0), 0);
                return accVP + totalPorViagem;
            }, 0);
            return acc + totalPorParticipante;
        }, 0)
    }));

    return eventosComTotal;
}

}
