import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCargoDiariaDto } from './dto/create-cargo_diaria.dto';
import { UpdateCargoDiariaDto } from './dto/update-cargo_diaria.dto';

@Injectable()
export class CargoDiariasService {
  constructor(private prisma: PrismaService) {}
  
  async create(dto: CreateCargoDiariaDto) {   
    return this.prisma.cargo_diarias.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.cargo_diarias.findMany();
  }

  findDiariasPorCargo(cargo: string){
    return this.prisma.cargo_diarias.findMany({
      where: {
        cargo: cargo.trim(),
      }, include: {
        valor_diarias: true
      }
    });
  }

  findCargoDasDiarias(id: number) {
    return this.prisma.cargo_diarias.findMany({
      where: {
        valor_diarias_id: id,
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} cargoDiaria`;
  }

  update(id: number, updateCargoDiariaDto: UpdateCargoDiariaDto) {
    return `This action updates a #${id} cargoDiaria`;
  }

  remove(id: number) {
    return `This action removes a #${id} cargoDiaria`;
  }
}
