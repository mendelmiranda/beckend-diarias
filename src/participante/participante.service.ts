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

  pesquisarParticipantePorCpf(cpf: string) {
    return this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
        tipo: 'C',
      },
      include: {
        cidade: true,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} participante`;
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
