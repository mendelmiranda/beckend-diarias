import { Injectable } from '@nestjs/common';
import { CreateDiariaCondutorDto } from './dto/create-diaria_condutor.dto';
import { UpdateDiariaCondutorDto } from './dto/update-diaria_condutor.dto';
import { PrismaService } from 'prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class DiariaCondutorService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createDiariaCondutorDto: CreateDiariaCondutorDto) {
    
    try {
      const result = await this.prisma.diaria_condutor.create({
        data: createDiariaCondutorDto,
      });
      return result;
    } catch (error) {
      console.log('error', error);
      
      if (error instanceof PrismaClientKnownRequestError) {
        // Aqui você pode tratar erros específicos de Prisma. Por exemplo:
        if (error.code === 'P2002') {
          throw new Error('Um registro duplicado foi encontrado.');
        }
      }
      // Tratar outros tipos de erro que não são específicos do Prisma
      throw new Error('Erro ao criar diária de condutor: ' + error.message);
    }
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
