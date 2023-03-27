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

  async findCidadePais(descricao: string) {
    const resultado = this.prisma.$queryRaw(
      Prisma.sql`SELECT descricao as descricao FROM cidade WHERE UPPER(descricao) LIKE '%${descricao}%'
                        UNION
                        SELECT nome_pt as descricao FROM pais WHERE UPPER(nome_pt) LIKE '%${descricao}%'`);

    return await resultado;
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
