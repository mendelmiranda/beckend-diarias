import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { conta_diaria } from '@prisma/client';
import { CreateContaDiariaDto } from 'src/conta_diaria/dto/create-conta_diaria.dto';

@Injectable()
export class ParticipanteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateParticipanteDto) {

    if(dto.tipo === "C"){
      return this.cadastraColaborador(dto);
    } 
    

    return this.prisma.participante.create({
      data: dto,
    });
  }

  async cadastraColaborador(dto: CreateParticipanteDto){    
      const remove = 'conta_diaria';
      const prop = 'conta_diaria';
      const contaX: conta_diaria = dto[prop][0];      
      
      delete dto[remove];

      const participante = this.prisma.participante.create({
        data: dto,
      });

      const modeloConta: CreateContaDiariaDto = {
        ...contaX,
        participante_id: (await participante).id,
      }

      return this.prisma.conta_diaria.create({
        data: modeloConta,
      })      

    
  }

  findAll() {
    return `This action returns all participante`;
  }

  pesquisarParticipantePorCpf(cpf: string) {
    return this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
        tipo: {not:'S'},
      },
      include: {
        cidade: true,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.participante.findFirst({
      where: {
        id: id,
      }
    })
  }

  update(id: number, updateParticipanteDto: UpdateParticipanteDto) {
    return this.prisma.participante.update({
      where: { id },
      data: updateParticipanteDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} participante`;
  }
}
