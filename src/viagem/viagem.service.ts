import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CidadeService } from 'src/cidade/cidade.service';
import CalculoDiaria, { ServidoresCalculo } from './calculo-diarias';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';
import { ParticipanteService } from '../participante/participante.service';

@Injectable()
export class ViagemService {
  constructor(private prisma: PrismaService, 
    private cidadeService: CidadeService,
    private participanteService: ParticipanteService) {}

  async create(dto: CreateViagemDto) {    
    const localizaCidade = this.cidadeService.findOne(dto.cidade_destino_id);
    const uf = (await localizaCidade).estado.uf;

    //const localizaParticipante = this.participanteService.pesquisarParticipantePorCpf(dto.ev)
    

    const calcula = new CalculoDiaria();
    calcula.membros(uf);

    return;   


    return this.prisma.viagem.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all viagem`;
  }

  findOne(id: number) {
    return `This action returns a #${id} viagem`;
  }

  update(id: number, updateViagemDto: UpdateViagemDto) {
    return this.prisma.evento.update({
      where: { id },
      data: updateViagemDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} viagem`;
  }
}
