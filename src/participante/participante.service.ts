import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';

@Injectable()
export class ParticipanteService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateParticipanteDto) {   
    return this.prisma.participante.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all participante`;
  }

  pesquisarParticipantePorCpf(cpf: string){
    return this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
      },
      include: {
        cidade: {
          include: {
            estado: true,
          }
        },
        
      },
      orderBy: [
       { id: "asc"}
      ]
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} participante`;
  }

  update(id: number, updateParticipanteDto: UpdateParticipanteDto) {
    return `This action updates a #${id} participante`;
  }

  remove(id: number) {
    return `This action removes a #${id} participante`;
  }
}
