import { Injectable } from '@nestjs/common';
import { CreateLogSistemaDto } from './dto/create-log_sistema.dto';
import { UpdateLogSistemaDto } from './dto/update-log_sistema.dto';
import { PrismaService } from 'prisma/prisma.service';
import { DateTime } from "luxon";
import { Operacao } from './log_enum';


@Injectable()
export class LogSistemaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateLogSistemaDto): Promise<CreateLogSistemaDto> {
    return this.prisma.log_sistema.create({
      data: dto,
    });
  }

  async createLog(dto: any, usuario: InfoUsuario, operacao: Operacao){
    
    const logSistemaDto: CreateLogSistemaDto = {
      datareg: DateTime.now().toJSDate(),
      linha: Object.values(dto) + '',
      usuario:  usuario.nomeCompleto + ' '+ usuario.username,
      operacao: operacao,
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
