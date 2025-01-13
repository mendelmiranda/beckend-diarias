import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { conta_diaria } from '@prisma/client';
import { CreateContaDiariaDto } from 'src/conta_diaria/dto/create-conta_diaria.dto';

@Injectable()
export class ParticipanteService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreateParticipanteDto) {   

    if (dto.tipo === "C" || dto.tipo === "T") {
      return this.cadastraColaborador(dto);
    }

    return this.prisma.participante.create({
      data: dto,
    });
  }

  async cadastraColaborador(dto: CreateParticipanteDto) {

    const remove = 'conta_diaria';
    const prop = 'conta_diaria';
    const contaX: conta_diaria = dto[prop][0];

    delete dto[remove];

    const participante = await this.prisma.participante.create({
      data: dto,
    });
    
    const participanteId = participante.id;

    const modeloConta: CreateContaDiariaDto = {
      ...contaX,
      participante_id: participanteId,
    }

    if(modeloConta.id > 0){
      await this.prisma.conta_diaria.update({
        where: { id: modeloConta.id },
        data: modeloConta,
      });
    } else {
      await this.prisma.conta_diaria.create({
        data: modeloConta,
      });
    }

    return participanteId;

  }

  findAll() {
    return `This action returns all participante`;
  }

  async pesquisarParticipantePorCpf(cpf: string) {    
    const resultado = await this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
        tipo: { not: 'S' },
      },
      include: {
        cidade: true,
      },
      orderBy: [{ id: 'desc' }],
    });
    
    if (!resultado) {
      throw new NotFoundException({
        message: `Participante não encontrado`,
        error: 'Not Found',
        statusCode: 404,
        details: {
          cpf: cpf,
          timestamp: new Date().toISOString()
        }
      });
    }

    return resultado;
  }

  pesquisarParticipanteServidorPorCpf(cpf: string) {
    return this.prisma.participante.findFirst({
      where: {
        cpf: cpf,
        tipo: { not: 'T' },
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

  async createS3i(dto: CreateParticipanteDto) {
    try {
      const existeParticipante = await this.prisma.participante.findFirst({
        where: {
          cpf: dto.cpf,
        },
        select: {
          id: true, // Seleciona apenas o ID
        }
      });

      if (existeParticipante) {
        console.log('Participante já cadastrado', existeParticipante);

        return existeParticipante.id; // Retorna apenas o ID
      } else {
        const participante = await this.prisma.participante.create({
          data: dto,
          select: {
            id: true, // Seleciona apenas o ID
          }
        });        

        return participante.id; // Retorna apenas o ID
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new HttpException('Erro de duplicidade de dados.', HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException('Erro ao criar participante', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


  private isEquivalent(dto: CreateParticipanteDto, existeParticipante: any): boolean {
    const relevantFields = ['lotacao', 'cargo', 'classe'];

    return relevantFields.every(field => dto[field] === existeParticipante[field]);
  }



}
