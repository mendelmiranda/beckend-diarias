import { Injectable } from '@nestjs/common';
import { CreateAprovacaoDefinitivaDaofDto } from './dto/create-aprovacao_definitiva_daof.dto';
import { UpdateAprovacaoDefinitivaDaofDto } from './dto/update-aprovacao_definitiva_daof.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Util } from 'src/util/Util';

@Injectable()
export class AprovacaoDefinitivaDaofService {

  constructor(private prisma: PrismaService) {}

  create(dto: CreateAprovacaoDefinitivaDaofDto) {
    return this.prisma.aprovacao_definitiva_daof.create({
      data: {
        ...dto,
        datareg: new Date(),
        hora: Util.horaAtual(),
      },
    });
  }

  findAssinaturaDiretorDAOF(solicitacaoId: number) {
    return this.prisma.aprovacao_definitiva_daof.findFirst({
      where: {
        AND: {
          solicitacao_id: solicitacaoId,
          assinatura_daof: {
            ativo: 'SIM'
          }
        }        
      },
      include: {
        assinatura_daof: true,
      },
    });
  }

  findAll() {
    return `This action returns all aprovacaoDefinitivaDaof`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aprovacaoDefinitivaDaof`;
  }

  update(id: number, updateAprovacaoDefinitivaDaofDto: UpdateAprovacaoDefinitivaDaofDto) {
    return `This action updates a #${id} aprovacaoDefinitivaDaof`;
  }

  remove(id: number) {
    return `This action removes a #${id} aprovacaoDefinitivaDaof`;
  }
}
