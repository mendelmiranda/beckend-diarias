import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateViagemEventoDto } from './dto/create-viagem_evento.dto';
import { UpdateViagemEventoDto } from './dto/update-viagem_evento.dto';

@Injectable()
export class ViagemEventoService {

  constructor(
    private prisma: PrismaService,) { }


  async create(createViagemEventoDto: CreateViagemEventoDto) {

    return this.prisma.viagem_evento.create({ data: createViagemEventoDto });
  }

  findAll() {
    return `This action returns all viagemEvento`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viagemEvento`;
  }

  findVigensPorEventoId(id: number) {
    return this.prisma.viagem_evento.findMany({
      where: {
        evento_id: id
      },
      include: {
        viagem: {
          include: {
            origem: true,
            destino: true,
            pais: true,
          }
        }
      },
      orderBy: {
        id: 'asc'
      }
    });

  }

  update(id: number, updateViagemEventoDto: UpdateViagemEventoDto) {
    return `This action updates a #${id} viagemEvento`;
  }

  async remove(id: number) {

    const pesquisarViagem = await this.prisma.viagem_evento.findUnique({
      where: {
        id: id
      }
    });


    return await this.prisma.viagem_evento.delete({
      where: {
        id: id
      }
    }).then(async () => {

      await this.prisma.viagem.delete({
        where: {
          id: pesquisarViagem.viagem_id
        }
      });

      return { message: 'ViagemEvento removido com sucesso' }
      }).catch(() => {
        return { message: 'Erro ao remover ViagemEvento' }
        });
  }
}
