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
import { AeroportoService } from '../aeroporto/aeroporto.service';
import { CargoDiariasService } from '../cargo_diarias/cargo_diarias.service';

@Injectable()
export class ViagemService {
  constructor(private prisma: PrismaService, 
    private cidadeService: CidadeService,
    private aeroportoService: AeroportoService,
    private eventoParticipanteService: EventoParticipantesService,
    private cargoDiariaService: CargoDiariasService) {}

  async create(dto: CreateViagemDto) {    
    return this.prisma.viagem.create({
      data: dto,
    });
  }

  async calculaDiaria(idViagem: number, idEventoParticipante){            

    const localizaEventoParticipante = await this.eventoParticipanteService.findOne(+idEventoParticipante);

    //testar ESSA PARTE
    if(localizaEventoParticipante.participante.tipo === "S"){
      const cargo = localizaEventoParticipante.participante.cargo; 
      const temViagem = localizaEventoParticipante.evento.tem_passagem;    
  
      //REFATORAR ESSA PARTE
      let localizaViagem;
      let uf;
      if(temViagem === "NAO"){
        localizaViagem = await this.findOne(idViagem);   
        const localizaCidade = await this.cidadeService.findOne(localizaViagem.cidade_destino_id);
        uf = localizaCidade.estado.uf;
      } 
      
      if(temViagem === "SIM" && localizaEventoParticipante.evento.exterior === "NAO"){
        localizaViagem = await this.findOne(idViagem);   
        const aeroporto = await this.aeroportoService.findOne(localizaViagem.destino_id);            
        uf = aeroporto.uf;
      }
  
      if(temViagem === "SIM" && localizaEventoParticipante.evento.exterior === "SIM"){
        localizaViagem = await this.findOne(idViagem);   
        const aeroporto = await this.aeroportoService.findOne(localizaViagem.destino_id);            
        uf = "SP";
      }
  
  
      const calculo = await this.cargoDiariaService.findDiariasPorCargo(cargo);
  
      const calcula = new CalculoDiariasServidores();
      return calcula.servidores(localizaViagem, uf, calculo.valor_diarias);    
    }

    return null;
  }

  findAll() {
    return `This action returns all viagem`;
  }

  findOne(id: number) {
    return this.prisma.viagem.findFirst({
      where: {
        id: id
      }, include: {
        cidade_origem: true,
        cidade_destino: true,
        origem: true,
        destino: true,
      }
    });
  }

  update(id: number, updateViagemDto: UpdateViagemDto) {

    const prop = 'id';
    delete updateViagemDto[prop];    

    return this.prisma.viagem.update({
      where: { id },
      data: updateViagemDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} viagem`;
  }
}
