import { Injectable } from '@nestjs/common';
import { CreateCorrecaoSolicitacaoDto } from './dto/create-correcao_solicitacao.dto';
import { UpdateCorrecaoSolicitacaoDto } from './dto/update-correcao_solicitacao.dto';

@Injectable()
export class CorrecaoSolicitacaoService {
  create(createCorrecaoSolicitacaoDto: CreateCorrecaoSolicitacaoDto) {
    return 'This action adds a new correcaoSolicitacao';
  }

  findAll() {
    return `This action returns all correcaoSolicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} correcaoSolicitacao`;
  }

  update(id: number, updateCorrecaoSolicitacaoDto: UpdateCorrecaoSolicitacaoDto) {
    return `This action updates a #${id} correcaoSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} correcaoSolicitacao`;
  }
}
