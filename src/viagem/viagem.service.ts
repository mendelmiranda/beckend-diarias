import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CidadeService } from 'src/cidade/cidade.service';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';
import { ParticipanteService } from '../participante/participante.service';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import CalculoDiaria from './calculo-diarias-membros';
import CalculoDiariasServidores from './calculo-diarias-servidores';

@Injectable()
export class ViagemService {
  constructor(private prisma: PrismaService, 
    private cidadeService: CidadeService,
    private eventoParticipanteService: EventoParticipantesService,) {}

  async create(dto: CreateViagemDto) {    
    return this.prisma.viagem.create({
      data: dto,
    });
  }

  async calculaDiaria(idViagem: number, idEventoParticipante){            

    const localizaViagem = await this.findOne(idViagem);    
    const localizaCidade = await this.cidadeService.findOne(localizaViagem.cidade_destino_id);
    const uf = localizaCidade.estado.uf;

    const localizaEventoParticipante = await this.eventoParticipanteService.findOne(+idEventoParticipante);
    const cargo = localizaEventoParticipante.participante.cargo; 
    const classe = localizaEventoParticipante.participante.classe;  
    
    console.log('classe', classe);
    

    /* const calcula = new CalculoDiaria();
    return calcula.membros(localizaViagem, uf, cargo, classe); */

    const calcula = new CalculoDiariasServidores();
    return calcula.servidores(localizaViagem, uf, cargo, classe);
    
  }

  findAll() {
    return `This action returns all viagem`;
  }

  findOne(id: number) {
    return this.prisma.viagem.findFirst({
      where: {
        id: id
      }
    });
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
