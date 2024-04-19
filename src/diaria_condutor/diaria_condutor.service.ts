import { Injectable } from '@nestjs/common';
import { CreateDiariaCondutorDto } from './dto/create-diaria_condutor.dto';
import { UpdateDiariaCondutorDto } from './dto/update-diaria_condutor.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class DiariaCondutorService {
  constructor(private readonly prisma: PrismaService) {}
  
  create(createDiariaCondutorDto: CreateDiariaCondutorDto) {
    return this.prisma.diaria_condutor.create({
      data: createDiariaCondutorDto,
    });
  }

  findAll() {
    return this.prisma.diaria_condutor.findMany();
  }

  findOne(id: number) {
    return this.prisma.diaria_condutor.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateDiariaCondutorDto: UpdateDiariaCondutorDto) {
    return this.prisma.diaria_condutor.update({
      where: { id: id },
      data: updateDiariaCondutorDto,
    });
  }

  remove(id: number) {
    return this.prisma.diaria_condutor.delete({
      where: { id: id },
    });
  }
}
