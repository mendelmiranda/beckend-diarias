import { Injectable } from '@nestjs/common';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class AssinaturaService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateAssinaturaDto) {
    return this.prisma.assinatura.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all assinatura`;
  }

  findAssinaturaAtiva(){
    return this.prisma.assinatura.findFirst(
      {
        where: {
          ativo: "SIM"
        }
      }
    )
  }

  findOne(id: number) {
    return `This action returns a #${id} assinatura`;
  }

  update(id: number, updateAssinaturaDto: UpdateAssinaturaDto) {
    return `This action updates a #${id} assinatura`;
  }

  remove(id: number) {
    return `This action removes a #${id} assinatura`;
  }
}
