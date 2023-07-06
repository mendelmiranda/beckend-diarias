import { Injectable } from '@nestjs/common';
import { CreateLogSistemaDto } from './dto/create-log_sistema.dto';
import { UpdateLogSistemaDto } from './dto/update-log_sistema.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class LogSistemaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLogSistemaDto): Promise<CreateLogSistemaDto> {
    return this.prisma.log_sistema.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all logSistema`;
  }

  findOne(id: number) {
    return `This action returns a #${id} logSistema`;
  }

  update(id: number, updateLogSistemaDto: UpdateLogSistemaDto) {
    return `This action updates a #${id} logSistema`;
  }

  remove(id: number) {
    return `This action removes a #${id} logSistema`;
  }
}
