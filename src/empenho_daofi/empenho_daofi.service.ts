import { Injectable } from '@nestjs/common';
import { CreateEmpenhoDaofiDto } from './dto/create-empenho_daofi.dto';
import { UpdateEmpenhoDaofiDto } from './dto/update-empenho_daofi.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EmpenhoDaofiService {
  constructor(private prisma: PrismaService) {}
  
  create(dto: CreateEmpenhoDaofiDto) {
    return this.prisma.empenho_daofi.create({
      data: dto,      
    });
  }

  findAll() {
    return this.prisma.empenho_daofi.findMany();
  }

  findOne(id: number) {
    return this.prisma.empenho_daofi.findUnique({
      where: {
        id: id
      }
    })
  }

  update(id: number, updateEmpenhoDaofiDto: UpdateEmpenhoDaofiDto) {
    return `This action updates a #${id} empenhoDaofi`;
  }

  remove(id: number) {
    return `This action removes a #${id} empenhoDaofi`;
  }
}
