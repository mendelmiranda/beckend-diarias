import { Injectable } from '@nestjs/common';
import { CreateAprovacaoDefinitivaDaofDto } from './dto/create-aprovacao_definitiva_daof.dto';
import { UpdateAprovacaoDefinitivaDaofDto } from './dto/update-aprovacao_definitiva_daof.dto';

@Injectable()
export class AprovacaoDefinitivaDaofService {
  create(createAprovacaoDefinitivaDaofDto: CreateAprovacaoDefinitivaDaofDto) {
    return 'This action adds a new aprovacaoDefinitivaDaof';
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
