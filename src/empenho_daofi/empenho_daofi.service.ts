import { Injectable } from '@nestjs/common';
import { CreateEmpenhoDaofiDto } from './dto/create-empenho_daofi.dto';
import { UpdateEmpenhoDaofiDto } from './dto/update-empenho_daofi.dto';

@Injectable()
export class EmpenhoDaofiService {
  create(createEmpenhoDaofiDto: CreateEmpenhoDaofiDto) {
    return 'This action adds a new empenhoDaofi';
  }

  findAll() {
    return `This action returns all empenhoDaofi`;
  }

  findOne(id: number) {
    return `This action returns a #${id} empenhoDaofi`;
  }

  update(id: number, updateEmpenhoDaofiDto: UpdateEmpenhoDaofiDto) {
    return `This action updates a #${id} empenhoDaofi`;
  }

  remove(id: number) {
    return `This action removes a #${id} empenhoDaofi`;
  }
}
