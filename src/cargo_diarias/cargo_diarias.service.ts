import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCargoDiariaDto } from './dto/create-cargo_diaria.dto';
import { UpdateCargoDiariaDto } from './dto/update-cargo_diaria.dto';
import { InfoUsuario, LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { Operacao } from 'src/log_sistema/log_enum';

@Injectable()
export class CargoDiariasService {
  constructor(private prisma: PrismaService, private logSistemaService: LogSistemaService) {}
  
  async create(dto: CreateCargoDiariaDto, usuario: InfoUsuario) {   
    await this.logSistemaService.createLog(dto, usuario, Operacao.INSERT);

    return this.prisma.cargo_diarias.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.cargo_diarias.findMany({
      where: {},
      distinct: ['cargo']
    });
  }

async findDiariasPorCargo(cargo: string){
    return this.prisma.cargo_diarias.findFirst({
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
    return this.prisma.cargo_diarias.findUnique({
      where: {
        id: id
      }    
    });
  }

  update(id: number, updateCargoDiariaDto: UpdateCargoDiariaDto) {
    return `This action updates a #${id} cargoDiaria`;
  }

  async remove(id: number, usuario: InfoUsuario) {
    
    const dto = await this.findOne(id);
    await this.logSistemaService.createLog(dto, usuario, Operacao.DELETE);

    return await this.prisma.cargo_diarias.delete({
      where: {
        id: id
      }
    })
  }
}
