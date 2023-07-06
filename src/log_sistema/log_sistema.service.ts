import { Injectable } from '@nestjs/common';
import { CreateLogSistemaDto } from './dto/create-log_sistema.dto';
import { UpdateLogSistemaDto } from './dto/update-log_sistema.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DateTime } from "luxon";


@Injectable()
export class LogSistemaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLogSistemaDto): Promise<CreateLogSistemaDto> {
    return this.prisma.log_sistema.create({
      data: dto,
    });
  }

  async createLog(dto: any, usuario: InfoUsuario){
    console.log(DateTime.now().setZone('America/Belem'));
    

    const logSistemaDto: CreateLogSistemaDto = {
      datareg: DateTime.now().setZone('America/Belem').toJSDate(),
      linha: Object.values(dto) + '',
      usuario:  usuario.nomeCompleto + ' '+ usuario.username,
      operacao: 'INSERT',
    }
    await this.prisma.log_sistema.create({
      data: logSistemaDto,
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

export interface InfoUsuario {
  accessToken: string;
  id: string;
  username: string;
  nomeCompleto: string; 
  expirationIn: string;
  roles: string;
  cpf: string; 
}
