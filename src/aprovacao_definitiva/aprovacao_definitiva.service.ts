import { Injectable } from '@nestjs/common';
import { CreateAprovacaoDefinitivaDto } from './dto/create-aprovacao_definitiva.dto';
import { UpdateAprovacaoDefinitivaDto } from './dto/update-aprovacao_definitiva.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Util } from 'src/util/Util';

@Injectable()
export class AprovacaoDefinitivaService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAprovacaoDefinitivaDto) {
    const dados: CreateAprovacaoDefinitivaDto = {
      ...dto,
      datareg: new Date(),
      hora: Util.horaAtual(),
    };
    return this.prisma.aprovacao_definitiva.create({
      data: dados,
    });
  }

  findAll() {
    return `This action returns all aprovacaoDefinitiva`;
  }

  findAssinaturaPresidente(solicitacaoId: number) {
    return this.prisma.aprovacao_definitiva.findFirst({
      where: {
        solicitacao_id: solicitacaoId,
      },
      include: {
        assinatura: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} aprovacaoDefinitiva`;
  }

  update(id: number, updateAprovacaoDefinitivaDto: UpdateAprovacaoDefinitivaDto) {
    return `This action updates a #${id} aprovacaoDefinitiva`;
  }

  remove(id: number) {
    return `This action removes a #${id} aprovacaoDefinitiva`;
  }
}
