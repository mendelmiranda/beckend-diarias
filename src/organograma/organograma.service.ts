import { Injectable } from '@nestjs/common';
import { CreateOrganogramaDto } from './dto/create-organograma.dto';
import { UpdateOrganogramaDto } from './dto/update-organograma.dto';

@Injectable()
export class OrganogramaService {
  create(createOrganogramaDto: CreateOrganogramaDto) {
    return 'This action adds a new organograma';
  }

  findAll() {
    return `This action returns all organograma`;
  }

  findOne(id: number) {
    return `This action returns a #${id} organograma`;
  }

  update(id: number, updateOrganogramaDto: UpdateOrganogramaDto) {
    return `This action updates a #${id} organograma`;
  }

  remove(id: number) {
    return `This action removes a #${id} organograma`;
  }
}
