import { Injectable } from '@nestjs/common';
import { CreateCorrecaoSolicitacaoDto } from './dto/create-correcao_solicitacao.dto';
import { UpdateCorrecaoSolicitacaoDto } from './dto/update-correcao_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CorrecaoSolicitacaoService {
  constructor(private prisma: PrismaService) {}
  
  create(dto: CreateCorrecaoSolicitacaoDto) {    
    const data: CreateCorrecaoSolicitacaoDto = {
      ...dto,
      datareg: new Date(),    
    }

    return this.prisma.correcao_solicitacao.create({
      data: data,
    });
  }

  findAll() {
    return this.prisma.correcao_solicitacao.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} correcaoSolicitacao`;
  }

  carregarSolicitacaoParaCorrecao(idSolicitacao: number){
    return this.prisma.correcao_solicitacao.findMany({
      where: {
        solicitacao_id: idSolicitacao
      },
      orderBy: [{id: 'desc'}]
    });
  }

  update(id: number, updateCorrecaoSolicitacaoDto: UpdateCorrecaoSolicitacaoDto) {
    return this.prisma.solicitacao.update({
      where: { id },
      data: updateCorrecaoSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} correcaoSolicitacao`;
  }
}
