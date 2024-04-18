import { Injectable } from '@nestjs/common';
import { CreateAssinaturaDaofDto } from './dto/create-assinatura_daof.dto';
import { UpdateAssinaturaDaofDto } from './dto/update-assinatura_daof.dto';
import { PrismaService } from 'prisma/prisma.service';
import { LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { Operacao } from 'src/log_sistema/log_enum';

@Injectable()
export class AssinaturaDaofService {
  constructor(private prisma: PrismaService, private logSistemaService: LogSistemaService) {}

  create(createAssinaturaDaofDto: CreateAssinaturaDaofDto) {

    //this.logSistemaService.createLog(createAssinaturaDaofDto, usuario, Operacao.INSERT);

    return this.prisma.assinatura_daof.create({
      data: createAssinaturaDaofDto,
    });
  }

  findAll() {
    return this.prisma.assinatura_daof.findMany({
      orderBy: [{ diretor: 'asc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.assinatura_daof.findUnique({
      where: { id: id },
    });
  }

  findOneByNonme(nome: string) {
    return this.prisma.assinatura_daof.findMany({
      where: { diretor: nome },
    });
  }

  update(id: number, updateAssinaturaDaofDto: UpdateAssinaturaDaofDto) {
    return this.prisma.assinatura_daof.update({
      where: { id: id },
      data: updateAssinaturaDaofDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} assinaturaDaof`;
  }
}
