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
import { viagem } from '@prisma/client';

@Injectable()
export class ViagemService {
  constructor(
    private prisma: PrismaService,
    private cidadeService: CidadeService,
    private aeroportoService: AeroportoService,
    private eventoParticipanteService: EventoParticipantesService,
    private cargoDiariaService: CargoDiariasService,
    private valorViagemService: ValorViagemService,
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

  async calculaDiaria(idViagem: number, idEventoParticipante) {
    const localizaEventoParticipante =
      await this.eventoParticipanteService.findOne(+idEventoParticipante);

    //testar ESSA PARTE
    if (localizaEventoParticipante.participante.tipo === 'S') {
      const cargo = localizaEventoParticipante.participante.cargo;
      const temViagem = localizaEventoParticipante.evento.tem_passagem;

      //REFATORAR ESSA PARTE
      let localizaViagem;
      let uf;
      if (temViagem === 'NAO') {
        localizaViagem = await this.findOne(idViagem);
        const localizaCidade = await this.cidadeService.findOne(
          localizaViagem.cidade_destino_id,
        );
        uf = localizaCidade.estado.uf;
      }

      if (
        temViagem === 'SIM' &&
        localizaEventoParticipante.evento.exterior === 'NAO'
      ) {
        localizaViagem = await this.findOne(idViagem);
        const aeroporto = await this.aeroportoService.findOne(
          localizaViagem.destino_id,
        );
        uf = aeroporto.uf;
      }

      if (
        temViagem === 'SIM' &&
        localizaEventoParticipante.evento.exterior === 'SIM'
      ) {
        localizaViagem = await this.findOne(idViagem);
        const aeroporto = await this.aeroportoService.findOne(
          localizaViagem.destino_id,
        );
        uf = 'SP';
      }

      const calculo = await this.cargoDiariaService.findDiariasPorCargo(cargo);
      const calcula = new CalculoDiariasServidores();
      const resultadoCalculo = calcula.servidores(
        localizaViagem,
        uf,
        calculo.valor_diarias,
      );
      const resultadoNacionalParaInternacional = calcula.valorNacional(
        localizaViagem,
        uf,
        calculo.valor_diarias,
      );

      //adicionar valor_viagem
      const findViagem = await this.findOne(idViagem);

      const valorViagem: CreateValorViagemDto = {
        viagem_id: idViagem,
        tipo: 'DIARIA',
        destino: findViagem.exterior === 'SIM' ? 'INTERNACIONAL' : 'NACIONAL',
        valor_individual: resultadoCalculo,
      };

      if (findViagem.exterior === 'SIM') {
        const valorViagem: CreateValorViagemDto = {
          viagem_id: idViagem,
          tipo: 'DIARIA',
          destino: 'NACIONAL',
          valor_individual: resultadoNacionalParaInternacional,
        };
        this.valorViagemService.create(valorViagem);
      }

      this.valorViagemService.create(valorViagem);
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
