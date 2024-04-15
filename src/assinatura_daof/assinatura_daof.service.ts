import { Injectable } from '@nestjs/common';
import { CreateAssinaturaDaofDto } from './dto/create-assinatura_daof.dto';
import { UpdateAssinaturaDaofDto } from './dto/update-assinatura_daof.dto';

@Injectable()
export class AssinaturaDaofService {
  create(createAssinaturaDaofDto: CreateAssinaturaDaofDto) {
    return 'This action adds a new assinaturaDaof';
  }

  findAll() {
    return `This action returns all assinaturaDaof`;
  }

  findOne(id: number) {
    return `This action returns a #${id} assinaturaDaof`;
  }

  update(id: number, updateAssinaturaDaofDto: UpdateAssinaturaDaofDto) {
    return `This action updates a #${id} assinaturaDaof`;
  }

  remove(id: number) {
    return `This action removes a #${id} assinaturaDaof`;
  }
}
