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
import { viagem, evento, valor_diarias, participante, evento_participantes } from '@prisma/client';
import { EventoService } from 'src/evento/evento.service';
import CalculoEstadual from 'src/calculo_diarias/estadual';
import CalculoNacional from 'src/calculo_diarias/externo';
import CalculoInternacional from 'src/calculo_diarias/internacional';
import { Municipios } from 'src/calculo_diarias/diarias-enum';

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

  async calculaDiaria(idViagem: number, participanteId: number, eventoId: number) {

    const localizaEvento             = await this.eventoService.findOne(eventoId);
    const localizaViagem             = await this.findOne(idViagem); 
    const localizaEventoParticipante = await this.eventoParticipanteService.findOne(+participanteId);
    const localizaCidade             = await this.localizaCidadeOuAeroporto(localizaViagem.cidade_destino_id, localizaViagem.destino_id);
    const cargo                      = await this.consultaCargo(participanteId);
        
    const parametros: any = {
      viagem: localizaViagem, 
      evento: localizaEvento,
      participante: localizaEventoParticipante,
      cargo: cargo,
      localizaCidade: localizaCidade,      
    }
    
    return await this.destinoMacapa(parametros) || 
           await this.destinoEstadual(parametros) || 
           await this.destinoNacional(parametros) || 
           await this.destinoInternacional(parametros);
  }

  async localizaCidadeOuAeroporto(cidadeId: number, aeroportoId: number) {    
    return cidadeId === null ? await this.aeroportoService.findOne(aeroportoId) : await this.cidadeService.findOne(cidadeId);    
  }

  async destinoEstadual(parametros: any) {   
      const evento = parametros.evento as evento;

      if (evento.tem_passagem === 'NAO' && parametros.localizaCidade.descricao !== Municipios.MACAPA ) {       
        const calculo = await this.cargoDiariaService.findDiariasPorCargo(parametros.cargo);

        const uf     = parametros.localizaCidade.estado.uf;
        const viagem = parametros.viagem;
        const cidade = parametros.viagem.cidade_destino.descricao;

        const calculoEstadual = new CalculoEstadual();
        const estatual = calculoEstadual.servidores(viagem, uf, cidade,calculo.valor_diarias, evento);                

        const valorViagem: CreateValorViagemDto = {
          viagem_id: parametros.viagem.id,
          tipo: 'DIARIA',
          destino: 'NACIONAL',
          valor_individual: estatual,
        };

        return this.valorViagemService.create(valorViagem);        
    }
    return 0;
  }

  async destinoNacional(parametros: any) {
    const evento = parametros.evento as evento;

    if (evento.tem_passagem === 'SIM' && evento.exterior === "NAO") {  
      const aeroporto = await this.aeroportoService.findOne(parametros.viagem.destino_id);
      const uf = aeroporto.uf;

      const calculo = await this.cargoDiariaService.findDiariasPorCargo(parametros.cargo);

      const calculoNacional = new CalculoNacional();
      const  nacional = calculoNacional.servidores(parametros.viagem, uf, calculo.valor_diarias, evento, evento.tem_passagem);             

      const valorViagem: CreateValorViagemDto = {
        viagem_id: parametros.viagem.id,
        tipo: 'DIARIA',
        destino: 'NACIONAL',
        valor_individual: nacional,
      };

      return this.valorViagemService.create(valorViagem);
    }    
    return 0;
  }

  async destinoInternacional(parametros: any){
    const evento = parametros.evento as evento;
    
    if (evento.tem_passagem === 'SIM'  && evento.exterior === "SIM") {     
      console.log('entrou internacional');

      const calculo = await this.cargoDiariaService.findDiariasPorCargo(parametros.cargo);
      
      const internacional = new CalculoInternacional();
      const resultadoCalculoInternacional = internacional.servidores(parametros.viagem, calculo.valor_diarias, evento, evento.tem_passagem);
      const inteira = internacional.valorNacional(parametros.viagem, calculo.valor_diarias);
      const meia    = internacional.valorNacionalMeia(parametros.viagem, calculo.valor_diarias);

      const valorViagemInternacional: CreateValorViagemDto = {
        viagem_id: parametros.id,
        tipo: 'DIARIA',
        destino: 'INTERNACIONAL' ,
        valor_individual: resultadoCalculoInternacional,
      };
      this.valorViagemService.create(valorViagemInternacional);

      const valorViagem: CreateValorViagemDto = {
        viagem_id: parametros.viagem.id,
        tipo: 'DIARIA',
        destino: 'NACIONAL',
        valor_individual: inteira,
      };
      this.valorViagemService.create(valorViagem);

      const valorViagemMeia: CreateValorViagemDto = {
        viagem_id: parametros.viagem.id,
        tipo: 'DIARIA',
        destino: 'NACIONAL',
        valor_individual: meia,
      };
      this.valorViagemService.create(valorViagemMeia);

      return resultadoCalculoInternacional;
    }
    return 0;
  }

  async destinoMacapa(parametros: any) {
    console.log('entrou macapa');
    if (parametros.temPassagem === 'NAO') {
      try {
        const localizaCidade = await this.cidadeService.findOne(parametros.viagem.localizaViagem.cidade_destino_id);
  
        if (localizaCidade.estado.uf === "AP" && localizaCidade.descricao === "Macapá") {
          return null;
        }
      } catch (error) {
        console.error('Ocorreu um erro ao buscar informações da viagem ou da cidade:', error);
        throw error;
      }
    }  
    return 0;
  }

  async consultaCargo(participanteId: number): Promise<string> {
    const localizaEventoParticipante = await this.eventoParticipanteService.findOne(+participanteId);
      const funcao  = localizaEventoParticipante.participante.funcao;
      let cargo     = localizaEventoParticipante.participante.cargo;
      const efetivo = localizaEventoParticipante.participante.efetivo;      
            
      if(efetivo.trim() === "SERVIDORES EFETIVOS" && funcao !== ""){
        cargo = funcao;
      }

      

      return cargo;
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