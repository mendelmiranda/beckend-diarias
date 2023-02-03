import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateBancoDto } from './dto/create-banco.dto';
import { UpdateBancoDto } from './dto/update-banco.dto';

@Injectable()
export class BancosService {
  constructor(private prisma: PrismaService) {}

  create(createBancoDto: CreateBancoDto) {
    return 'This action adds a new banco';
  }

  findAll() {
    return this.prisma.bancos.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} banco`;
  }

  update(id: number, updateBancoDto: UpdateBancoDto) {
    return `This action updates a #${id} banco`;
  }

  remove(id: number) {
    return `This action removes a #${id} banco`;
  }
}
