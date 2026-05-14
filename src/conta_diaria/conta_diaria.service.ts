import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

@Injectable()
export class ContaDiariaService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateContaDiariaDto) {

    let idContaBancaria = 0;
    let idParticipante = 0;

    const pesquisa = await this.prisma.conta_diaria.findMany({
      where: {
        cpf: dto.cpf,
      },
      orderBy: [
        { id: "desc" }
      ]
    });

    pesquisa.forEach(element => {
      idContaBancaria = element.id;
    });


    const pesquisaParticipante = await this.prisma.participante.findMany({
      where: {
        cpf: dto.cpf,
      },
      orderBy: [
        { id: "desc" }
      ]
    });

    if (pesquisaParticipante.length > 0) {
      idParticipante = pesquisaParticipante[0].id;
    }

    try {

      const data: Omit<UpdateContaDiariaDto, 'id'> = {
        nome: dto.nome,
        cpf: dto.cpf,
        tipo: dto.tipo,
        tipo_conta: dto.tipo_conta,
        agencia: dto.agencia,
        conta: dto.conta,
        banco_id: dto.banco_id,
        participante_id: idParticipante,
      };

      if (idContaBancaria === 0) {
        const conta = await this.prisma.conta_diaria.create({
          data: data,
        });
        return conta;
      } else {
        return this.prisma.conta_diaria.update({
          where: { id: idContaBancaria },
          data: data,
        });

      }

    } catch (error) {
      console.log(error)
    }

  }

  findAll() {
    return `This action returns all contaDiaria`;
  }

  pesquisaContaDoParticipantePorCpf(cpf: string) {
    return this.prisma.conta_diaria.findFirst({
      where: {
        cpf: cpf,
        tipo: { not: 'S' },
      },
      include: {
        banco: true,
      },
      orderBy: [
        { id: "desc" }
      ]
    });
  }

  /**
   * Conta para exibição (PDF etc.): tenta CPF só dígitos, CPF mascarado e, por fim, `participante_id`.
   */
  async pesquisaContaDoParticipanteGeralPorCpf(
    cpf: string,
    participanteId?: number,
  ) {
    const digits = (cpf ?? '').replace(/\D/g, '');
    const cpfVariants =
      digits.length === 11
        ? [
            digits,
            `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`,
          ]
        : cpf?.trim()
          ? [cpf.trim()]
          : [];

    if (cpfVariants.length > 0) {
      const porCpf = await this.prisma.conta_diaria.findFirst({
        where: { cpf: { in: cpfVariants } },
        include: { banco: true },
        orderBy: { id: 'desc' },
      });
      if (porCpf) return porCpf;
    }

    if (participanteId != null && participanteId > 0) {
      return this.prisma.conta_diaria.findFirst({
        where: { participante_id: participanteId },
        include: { banco: true },
        orderBy: { id: 'desc' },
      });
    }

    return null;
  }

  findOne(id: number) {
    return this.prisma.conta_diaria.findFirst({
      where: { id: id }
    });
  }

  update(id: number, updateContaDiariaDto: UpdateContaDiariaDto) {
    return this.prisma.conta_diaria.update({
      where: { id },
      data: updateContaDiariaDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} contaDiaria`;
  }
}
