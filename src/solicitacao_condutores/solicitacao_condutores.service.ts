import { Injectable } from '@nestjs/common';
import { CreateSolicitacaoCondutoreDto } from './dto/create-solicitacao_condutore.dto';
import { UpdateSolicitacaoCondutoreDto } from './dto/update-solicitacao_condutore.dto';

@Injectable()
export class SolicitacaoCondutoresService {
  create(createSolicitacaoCondutoreDto: CreateSolicitacaoCondutoreDto) {
    return 'This action adds a new solicitacaoCondutore';
  }

  findAll() {
    return `This action returns all solicitacaoCondutores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} solicitacaoCondutore`;
  }

  update(id: number, updateSolicitacaoCondutoreDto: UpdateSolicitacaoCondutoreDto) {
    return `This action updates a #${id} solicitacaoCondutore`;
  }

  remove(id: number) {
    return `This action removes a #${id} solicitacaoCondutore`;
  }
}
