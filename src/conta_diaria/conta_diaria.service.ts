import { Injectable } from '@nestjs/common';
import { conta_diaria } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { Operacao } from 'src/log_sistema/log_enum';
import { InfoUsuario, LogSistemaService } from 'src/log_sistema/log_sistema.service';
import {
  ContaDiariaInput,
  variantesCpf,
} from './conta-diaria.helpers';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

@Injectable()
export class ContaDiariaService {
  constructor(
    private prisma: PrismaService,
    private logSistemaService: LogSistemaService,
  ) { }

  /**
   * Cria ou atualiza conta vinculada ao participante (payload: `conta_diaria[]` ou `contaDiariaModel`).
   */
  async upsertForParticipante(
    participanteId: number,
    input: ContaDiariaInput,
    defaults?: { nome?: string; cpf?: string; tipo?: string },
    usuario?: InfoUsuario,
  ): Promise<conta_diaria | null> {
    if (!participanteId || participanteId <= 0) {
      return null;
    }

    const cpfRef = input.cpf ?? defaults?.cpf ?? '';
    const cpfVariants = variantesCpf(cpfRef);
    const cpfPersistir = cpfVariants[0] ?? cpfRef.trim();

    let existente: conta_diaria | null = null;

    if (input.id != null && input.id > 0) {
      existente = await this.prisma.conta_diaria.findFirst({
        where: { id: input.id },
      });
    }

    if (!existente) {
      existente = await this.prisma.conta_diaria.findFirst({
        where: { participante_id: participanteId },
        orderBy: { id: 'desc' },
      });
    }

    if (!existente && cpfVariants.length > 0) {
      existente = await this.prisma.conta_diaria.findFirst({
        where: { cpf: { in: cpfVariants } },
        orderBy: { id: 'desc' },
      });
    }

    const data: Omit<UpdateContaDiariaDto, 'id'> = {
      nome: (input.nome ?? defaults?.nome ?? '').trim(),
      cpf: cpfPersistir,
      tipo: input.tipo ?? defaults?.tipo ?? 'S',
      tipo_conta: input.tipo_conta ?? '',
      agencia: input.agencia ?? '',
      conta: input.conta ?? '',
      banco_id: input.banco_id ?? 0,
      participante_id: participanteId,
    };

    if (existente) {
      const atualizada = await this.prisma.conta_diaria.update({
        where: { id: existente.id },
        data,
      });
      await this.registrarLog(existente, atualizada, usuario, Operacao.UPDATE);
      return atualizada;
    }

    const criada = await this.prisma.conta_diaria.create({ data });
    await this.registrarLog(null, criada, usuario, Operacao.INSERT);
    return criada;
  }

  async create(dto: CreateContaDiariaDto, usuario?: InfoUsuario) {
    if (dto.participante_id != null && dto.participante_id > 0) {
      return this.upsertForParticipante(dto.participante_id, dto, undefined, usuario);
    }

    const cpfVariants = variantesCpf(dto.cpf);
    let idContaBancaria = 0;
    let idParticipante = 0;

    if (cpfVariants.length > 0) {
      const conta = await this.prisma.conta_diaria.findFirst({
        where: { cpf: { in: cpfVariants } },
        orderBy: { id: 'desc' },
      });
      if (conta) {
        idContaBancaria = conta.id;
      }

      const participante = await this.prisma.participante.findFirst({
        where: { cpf: { in: cpfVariants } },
        orderBy: { id: 'desc' },
      });
      if (participante) {
        idParticipante = participante.id;
      }
    }

    const data: Omit<UpdateContaDiariaDto, 'id'> = {
      nome: dto.nome,
      cpf: cpfVariants[0] ?? dto.cpf,
      tipo: dto.tipo,
      tipo_conta: dto.tipo_conta,
      agencia: dto.agencia,
      conta: dto.conta,
      banco_id: dto.banco_id,
      participante_id: idParticipante,
    };

    if (idContaBancaria === 0) {
      const criada = await this.prisma.conta_diaria.create({ data });
      await this.registrarLog(null, criada, usuario, Operacao.INSERT);
      return criada;
    }

    const anterior = await this.prisma.conta_diaria.findUnique({
      where: { id: idContaBancaria },
    });
    const atualizada = await this.prisma.conta_diaria.update({
      where: { id: idContaBancaria },
      data,
    });
    await this.registrarLog(anterior, atualizada, usuario, Operacao.UPDATE);
    return atualizada;
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

  async update(id: number, updateContaDiariaDto: UpdateContaDiariaDto, usuario: InfoUsuario) {
    const anterior = await this.prisma.conta_diaria.findUnique({ where: { id } });
    const data = { ...updateContaDiariaDto };
    delete data.id;
    const atualizada = await this.prisma.conta_diaria.update({
      where: { id },
      data,
    });
    await this.registrarLog(anterior, atualizada, usuario, Operacao.UPDATE);
    return atualizada;
  }

  private async registrarLog(
    anterior: conta_diaria | null,
    atual: conta_diaria,
    usuario: InfoUsuario | undefined,
    operacao: Operacao,
  ) {
    if (!usuario) return;

    await this.logSistemaService.createLog(
      {
        entidade: 'conta_diaria',
        operacao,
        conta_id: atual.id,
        participante_id: atual.participante_id,
        cpf: atual.cpf,
        nome: atual.nome,
        banco_id_anterior: anterior?.banco_id ?? '',
        agencia_anterior: anterior?.agencia ?? '',
        conta_anterior: anterior?.conta ?? '',
        banco_id: atual.banco_id,
        agencia: atual.agencia,
        conta: atual.conta,
      },
      usuario,
      operacao,
    );
  }

  remove(id: number) {
    return `This action removes a #${id} contaDiaria`;
  }
}
