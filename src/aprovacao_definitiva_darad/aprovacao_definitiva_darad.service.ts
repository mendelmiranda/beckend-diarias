import { Injectable } from '@nestjs/common';
import { CreateAprovacaoDefinitivaDaradDto } from './dto/create-aprovacao_definitiva_darad.dto';
import { UpdateAprovacaoDefinitivaDaradDto } from './dto/update-aprovacao_definitiva_darad.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Util } from 'src/util/Util';

@Injectable()
export class AprovacaoDefinitivaDaradService {

  constructor(private readonly prisma: PrismaService) {}
  
  create(dto: CreateAprovacaoDefinitivaDaradDto) {
    return this.prisma.aprovacao_definitiva.create({
      data: {
        ...dto,
        datareg: new Date(),
        hora: Util.horaAtual(),
      },
    });
  }

  findAssinaturaDiretorDARAD(solicitacaoId: number) {
    return this.prisma.aprovacao_definitiva_darad.findFirst({
      where: {
        solicitacao_id: solicitacaoId,
      },
      include: {
        assinatura_darad: true,
      },
    });
  }
  

  findAll() {
    return `This action returns all aprovacaoDefinitivaDarad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aprovacaoDefinitivaDarad`;
  }

  update(id: number, updateAprovacaoDefinitivaDaradDto: UpdateAprovacaoDefinitivaDaradDto) {
    return `This action updates a #${id} aprovacaoDefinitivaDarad`;
  }

  remove(id: number) {
    return `This action removes a #${id} aprovacaoDefinitivaDarad`;
  }
}
