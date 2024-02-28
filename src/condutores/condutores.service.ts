import { Injectable } from '@nestjs/common';
import { CreateCondutoreDto } from './dto/create-condutore.dto';
import { UpdateCondutoreDto } from './dto/update-condutore.dto';

@Injectable()
export class CondutoresService {
  create(createCondutoreDto: CreateCondutoreDto) {
    return 'This action adds a new condutore';
  }

  findAll() {
    return `This action returns all condutores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} condutore`;
  }

  update(id: number, updateCondutoreDto: UpdateCondutoreDto) {
    return `This action updates a #${id} condutore`;
  }

  remove(id: number) {
    return `This action removes a #${id} condutore`;
  }
}
