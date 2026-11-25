import { Injectable, Logger } from '@nestjs/common';
import { CreateViagemParticipanteDto } from './dto/create-viagem_participante.dto';
import { UpdateViagemParticipanteDto } from './dto/update-viagem_participante.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ViagemService } from 'src/viagem/viagem.service';

@Injectable()
export class ViagemParticipantesService {
  private readonly logger = new Logger(ViagemParticipantesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly viagemService: ViagemService,
  ) { }

  async create(dto: CreateViagemParticipanteDto) {

    try {
      const criado = await this.prisma.viagem_participantes.create({
        data: {
          evento_participantes: {
            connect: {
              id: dto.evento_participantes_id
            }
          },
          viagem: {
            connect: {
              id: dto.viagem_id
            }
          },
          datareg: new Date(),
          servidor_acompanhando: dto.servidor_acompanhando ?? '',
          viagem_diferente: dto.viagem_diferente ?? '',
          justificativa_diferente: dto.justificativa_diferente ?? '',
          data_ida_diferente: dto.data_ida_diferente ?? undefined,
          data_volta_diferente: dto.data_volta_diferente ?? undefined,
          arcar_passagem: dto.arcar_passagem ?? '',
          custos: dto.custos ?? [],
          justificativa_custos: dto.justificativa_custos ?? '',
          viagem_superior: dto.viagem_superior ?? '',
          viagem_pernoite: dto.viagem_pernoite ?? '',
          justificativa_municipios: dto.justificativa_municipios ?? '',
        }
      });
      await this.recalcularDiariasDaViagem(
        dto.viagem_id,
        dto.evento_participantes_id,
      );
      return criado;
    } catch (e) {
      console.log('erro', e);
      throw e;
    }
  }

  findAll() {
    return `This action returns all viagemParticipantes`;
  }

  findParticipantesViagemDoEvento(idEvento: number) {
    return this.prisma.viagem_participantes.findMany({
      where: {
        evento_participantes: {
          evento: { id: idEvento },
        },
      },

      include: {
        viagem: {
          include: {
            origem: true,
            destino: true,
            cidade_origem: true,
            cidade_destino: true,
            pais: true,
          },
        },

        evento_participantes: {
          include: { participante: true },
        },
      },
    });
  }

  findParticipanteDaViagem(id: number) {
    return this.prisma.viagem_participantes.findFirst(
      {
        where: {
          viagem_id: id
        },
        include: {
          evento_participantes: {
            include: {
              participante: true,
            }
          }
        }
      }
    )
  }

  findOne(id: number) {
    return this.prisma.viagem_participantes.findFirst({
      where: {
        id: id
      }
    })
  }

  findViagemDoParticipantePeloId(id: number) {
    return this.prisma.viagem_participantes.findFirst({
      where: {
        evento_participantes_id: id
      },
      include: {
        viagem: {
          include: {
            origem: true,
            destino: true,
            cidade_origem: true,
            cidade_destino: true,
            pais: true,
          },
        },

      }
    })
  }

  findParticipantesDaViagemPorId(viagemId: number) {
    return this.prisma.viagem_participantes.findMany({
      where: {
        viagem_id: viagemId
      },
      include: {
        evento_participantes: {
          include: {
            participante: true,
          }
        }
      }
    })
  }


  update(id: number, updateViagemParticipanteDto: UpdateViagemParticipanteDto) {

    return this.prisma.viagem_participantes.update(
      {
        where: {
          id: id
        },
        data: {
          servidor_acompanhando: updateViagemParticipanteDto.servidor_acompanhando,
          viagem_diferente: updateViagemParticipanteDto.viagem_diferente,
          justificativa_diferente: updateViagemParticipanteDto.justificativa_diferente,
          data_ida_diferente: updateViagemParticipanteDto.data_ida_diferente,
          data_volta_diferente: updateViagemParticipanteDto.data_volta_diferente,
          arcar_passagem: updateViagemParticipanteDto.arcar_passagem,
          custos: updateViagemParticipanteDto.custos,
          justificativa_custos: updateViagemParticipanteDto.justificativa_custos
        }
      }
    );
  }

  async remove(id: number) {
    const consultar = await this.prisma.viagem_participantes.findFirst({
      where: { id },
      select: {
        id: true,
        viagem_id: true,
        evento_participantes_id: true,
        evento_participantes: { select: { participante_id: true } },
      },
    });

    const removido = await this.prisma.viagem_participantes.delete({
      where: { id },
    });

    if (consultar) {
      await this.prisma.valor_viagem.deleteMany({
        where: {
          viagem_id: consultar.viagem_id,
          participante_id: consultar.evento_participantes.participante_id,
          tipo: 'DIARIA',
        },
      });
      await this.recalcularDiariasDaViagem(
        consultar.viagem_id,
        consultar.evento_participantes_id,
      );
    }

    return removido;
  }

  private async recalcularDiariasDaViagem(
    viagemId: number,
    eventoParticipantesId?: number,
  ) {
    const solicitacaoId = await this.solicitacaoIdDaViagem(
      viagemId,
      eventoParticipantesId,
    );
    if (!solicitacaoId) {
      this.logger.warn(
        `Viagem ${viagemId} sem solicitação; diária não recalculada`,
      );
      return;
    }

    const resultado = await this.viagemService.calcularEPersistirDiarias(
      solicitacaoId,
      true,
    );
    if (resultado.falhas.length > 0) {
      this.logger.warn(
        `Diárias da solicitação ${solicitacaoId} recalculadas com falha: ${resultado.falhas
          .map((falha) => `${falha.participanteId} ${falha.motivo}`)
          .join('; ')}`,
      );
    }
  }

  private async solicitacaoIdDaViagem(
    viagemId: number,
    eventoParticipantesId?: number,
  ): Promise<number | null> {
    const viagem = await this.prisma.viagem.findUnique({
      where: { id: viagemId },
      select: { solicitacao_id: true },
    });
    if (viagem?.solicitacao_id) return viagem.solicitacao_id;

    if (!eventoParticipantesId) return null;

    const vinculo = await this.prisma.evento_participantes.findFirst({
      where: { id: eventoParticipantesId },
      select: { evento: { select: { solicitacao_id: true } } },
    });
    return vinculo?.evento.solicitacao_id ?? null;
  }
}
