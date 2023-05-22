import { Injectable } from '@nestjs/common';
import { CreateEmpenhoDaofiDto } from './dto/create-empenho_daofi.dto';
import { UpdateEmpenhoDaofiDto } from './dto/update-empenho_daofi.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EmpenhoDaofiService {
  constructor(private prisma: PrismaService) {}
  
  create(dto: CreateEmpenhoDaofiDto) {

    const dados: CreateEmpenhoDaofiDto = {
      ...dto,
      datareg: new Date(),
    }

    return this.prisma.empenho_daofi.create({
      data: dados,      
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

  findEmpenhoPorSolicitacaoId(id: number) {
    return this.prisma.empenho_daofi.findMany({
      where: {
        solicitacao_id: id
      },
    })
  }

  update(id: number, updateEmpenhoDaofiDto: UpdateEmpenhoDaofiDto) {
    return `This action updates a #${id} empenhoDaofi`;
  }

  async remove(id: number) {
    return await this.prisma.empenho_daofi.delete({
      where: {
        id: id
      }
    })
  }

}
