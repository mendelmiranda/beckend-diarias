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
import { ValorViagemService } from 'src/valor_viagem/valor_viagem.service';
import { CreateValorViagemDto } from 'src/valor_viagem/dto/create-valor_viagem.dto';
import { viagem, evento } from '@prisma/client';
import { EventoService } from 'src/evento/evento.service';
import CalculoEstadual from 'src/calculo_diarias/estadual';
import CalculoNacional from 'src/calculo_diarias/externo';

@Injectable()
export class ViagemService {
  constructor(
    private prisma: PrismaService,
    private cidadeService: CidadeService,
    private aeroportoService: AeroportoService,
    private eventoParticipanteService: EventoParticipantesService,
    private cargoDiariaService: CargoDiariasService,
    private valorViagemService: ValorViagemService,
    private eventoService: EventoService,
  ) {}

  async create(dto: CreateViagemDto) {
    if (dto.destino_id > 0) {
      const { valor_viagem, ...newDto } = dto;

      return this.prisma.viagem.create({
        data: newDto,
      });
    } else {
      const dados: CreateViagemDto = {
        ...dto,
        origem_id: null,
        destino_id: null,
      };

      const { valor_viagem, ...newDto } = dados;

      return this.prisma.viagem.create({
        data: newDto,
      });
    }
  }

  async calculaDiaria(idViagem: number, idEventoParticipante, eventoId: number) {
    const localizaEventoParticipante = await this.eventoParticipanteService.findOne(+idEventoParticipante);
    
    this.destinoMacapa(idViagem, localizaEventoParticipante.evento.tem_passagem);

    const estadual: any = {
      idViagem: idViagem, 
      temPassagem: localizaEventoParticipante.evento.tem_passagem,
      idEventoParticipante: idEventoParticipante, 
      eventoId: eventoId,
      localizaEventoParticipante: localizaEventoParticipante
    }

    this.destinoEstadual(estadual);
    

    return null;
  }

  async destinoEstadual(parametrosEstadual: any) {

    const localizaEvento = this.eventoService.findOne(parametrosEstadual.eventoId);

    const datasEvento: any = {
      inicio: (await localizaEvento).inicio,
      fim: (await localizaEvento).fim
    }

    if (parametrosEstadual.localizaEventoParticipante.participante.tipo === 'S') {
      const funcao = parametrosEstadual.localizaEventoParticipante.participante.funcao;
      let cargo = parametrosEstadual.localizaEventoParticipante.participante.cargo;
      const efetivo = parametrosEstadual.localizaEventoParticipante.participante.efetivo;      
      
      if(efetivo.trim() === "SERVIDORES EFETIVOS" && funcao !== ""){
        cargo = funcao;
      }

      //SEPARAR

      if (parametrosEstadual.temPassagem === 'NAO') {
        const localizaViagem = await this.findOne(parametrosEstadual.idViagem);

        const localizaCidade = await this.cidadeService.findOne(localizaViagem.cidade_destino_id);        
        const uf = localizaCidade.estado.uf;
        const calculo = await this.cargoDiariaService.findDiariasPorCargo(cargo);

        const estadual = new CalculoEstadual();
        const resultadoCalculo = estadual.servidores(localizaViagem, uf, localizaViagem.cidade_destino.descricao,calculo.valor_diarias, datasEvento);        
        
        console.log(resultadoCalculo);       
        
      }


      //SEPARAR

      
      if (parametrosEstadual.temPassagem === 'SIM') {
        const localizaViagem = await this.findOne(parametrosEstadual.idViagem);               

        const localizaCidade = await this.aeroportoService.findOne(localizaViagem.destino.id);
        const uf = localizaCidade.uf;

        const calculo = await this.cargoDiariaService.findDiariasPorCargo(cargo);

        const nacional = new CalculoNacional();
        const resultadoCalculoNacional = nacional.servidores(localizaViagem, uf, calculo.valor_diarias, datasEvento, (await localizaEvento).tem_passagem);

        console.log(resultadoCalculoNacional);        
      }

      

    }


  }

  async destinoMacapa(idViagem: number, temPassagem: string) {
    if (temPassagem === 'NAO') {
      try {
        const localizaViagem = await this.findOne(idViagem);
        const localizaCidade = await this.cidadeService.findOne(localizaViagem.cidade_destino_id);
  
        if (localizaCidade.estado.uf === "AP" && localizaCidade.descricao === "Macapá") {
          return null;
        }
      } catch (error) {
        console.error('Ocorreu um erro ao buscar informações da viagem ou da cidade:', error);
        throw error;
      }
    }  
    return null;
  }

  findAll() {
    return `This action returns all viagem`;
  }

  findOne(id: number) {
    return this.prisma.viagem.findFirst({
      where: {
        id: id,
      },
      include: {
        cidade_origem: true,
        cidade_destino: true,
        origem: true,
        destino: true,
        pais: true,
        valor_viagem: true,
      },
    });
  }

  update(id: number, updateViagemDto: UpdateViagemDto) {
    const prop = 'id';
    delete updateViagemDto[prop];

    const { valor_viagem, ...newDto } = updateViagemDto;

    return this.prisma.viagem.update({
      where: { id },
      data: newDto,
    });

    //return `This action removes a #${id} viagem`;
  }

  remove(id: number) {
    return `This action removes a #${id} viagem`;
  }

  //REFAZER PARA A NOVA TABELA
  atualizarDiariaColaborador(id: number, updateViagemDto: UpdateViagemDto) {
    return `This action removes a #${id} viagem`;
    /* return this.prisma.viagem.update({
      where: { id },
      data: {
        valor_diaria: updateViagemDto.valor_diaria
      },
    }); */
  }
}