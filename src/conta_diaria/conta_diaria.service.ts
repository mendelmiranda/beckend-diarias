import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

@Injectable()
export class ContaDiariaService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContaDiariaDto) {      
    
    if(dto.id === 0 || dto.id === undefined){

    return this.prisma.conta_diaria.create({
      data: dto,
    });
    } else {
      const data: UpdateContaDiariaDto = {
        id: dto.id,
        nome: dto.nome,
        cpf: dto.cpf,
        tipo: dto.tipo,
        tipo_conta: dto.tipo_conta,
        agencia: dto.agencia,
        conta: dto.conta,
        banco_id: dto.banco_id,
      };

      await this.update(dto.id,data )
    }
  }

  findAll() {
    return `This action returns all contaDiaria`;
  }

  pesquisaContaDoParticipantePorCpf(cpf: string){
    return this.prisma.conta_diaria.findFirst({
      where: {
        cpf: cpf,
        tipo: {not:'S'},
      },
      include: {
        banco: true,
      },
      orderBy: [
       { id: "desc"}
      ]
    });
  }

  pesquisaContaDoParticipanteGeralPorCpf(cpf: string){
    return this.prisma.conta_diaria.findFirst({
      where: {
        cpf: cpf,
      },
      include: {
        banco: true,
      },
      orderBy: [
       { id: "desc"}
      ]
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} contaDiaria`;
  }

  update(id: number, updateContaDiariaDto: UpdateContaDiariaDto) {            
    return this.prisma.conta_diaria.update({
      where: { id },
      data: updateContaDiariaDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} contaDiaria`;
  }
}
