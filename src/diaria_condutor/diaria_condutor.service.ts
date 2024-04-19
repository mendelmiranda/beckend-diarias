import { Injectable } from '@nestjs/common';
import { CreateDiariaCondutorDto } from './dto/create-diaria_condutor.dto';
import { UpdateDiariaCondutorDto } from './dto/update-diaria_condutor.dto';

@Injectable()
export class DiariaCondutorService {
  create(createDiariaCondutorDto: CreateDiariaCondutorDto) {
    return 'This action adds a new diariaCondutor';
  }

  findAll() {
    return `This action returns all diariaCondutor`;
  }

  findOne(id: number) {
    return `This action returns a #${id} diariaCondutor`;
  }

  update(id: number, updateDiariaCondutorDto: UpdateDiariaCondutorDto) {
    return `This action updates a #${id} diariaCondutor`;
  }

  remove(id: number) {
    return `This action removes a #${id} diariaCondutor`;
  }
}
