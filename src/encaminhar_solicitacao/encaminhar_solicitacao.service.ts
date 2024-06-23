import { Injectable } from '@nestjs/common';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EncaminharSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateEncaminharSolicitacaoDto) {
    return this.prisma.encaminhar_solicitacao.create({
      data: {
        ...dto,
        datareg: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.encaminhar_solicitacao.findMany({
      include: {
        solicitacao: true,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.encaminhar_solicitacao.findUnique({
      where: { id: id },
    });
  }

  async findAvisoDoTramite(codLotacao: number) {
    let resultado;
   try {
    resultado = await this.prisma.encaminhar_solicitacao.findMany({
      where: {
        AND: {
          cod_lotacao_destino: codLotacao ?? 0,
          lido: 'NAO',
        },
      },
    });
   } catch (error) {
      console.log(error);
    }

    return resultado;

  }

  update(id: number, updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    return this.prisma.encaminhar_solicitacao.update({
      where: { id },
      data: updateEncaminharSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} encaminharSolicitacao`;
  }
}
