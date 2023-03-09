import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAeroportoDto } from './dto/create-aeroporto.dto';
import { UpdateAeroportoDto } from './dto/update-aeroporto.dto';

@Injectable()
export class AeroportoService {
  constructor(private prisma: PrismaService) {}
  
  create(createAeroportoDto: CreateAeroportoDto) {
    return 'This action adds a new aeroporto';
  }

  findAll() {
    return this.prisma.$queryRaw(
      Prisma.sql`SELECT a.id, cidade || ' ' ||uf as cidade FROM aeroporto a ORDER BY a.cidade`
    )
  }

  findOne(id: number) {
    return this.prisma.aeroporto.findFirst({
      where: {
        id: +id
      }
    })
  }

  update(id: number, updateAeroportoDto: UpdateAeroportoDto) {
    return `This action updates a #${id} aeroporto`;
  }

  remove(id: number) {
    return `This action removes a #${id} aeroporto`;
  }
}
