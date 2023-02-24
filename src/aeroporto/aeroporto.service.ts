import { Injectable } from '@nestjs/common';
import { CreateAeroportoDto } from './dto/create-aeroporto.dto';
import { UpdateAeroportoDto } from './dto/update-aeroporto.dto';

@Injectable()
export class AeroportoService {
  create(createAeroportoDto: CreateAeroportoDto) {
    return 'This action adds a new aeroporto';
  }

  findAll() {
    return `This action returns all aeroporto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} aeroporto`;
  }

  update(id: number, updateAeroportoDto: UpdateAeroportoDto) {
    return `This action updates a #${id} aeroporto`;
  }

  remove(id: number) {
    return `This action removes a #${id} aeroporto`;
  }
}
