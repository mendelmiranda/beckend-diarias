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
import { viagem, evento, valor_diarias, participante, evento_participantes, viagem_participantes } from '@prisma/client';
import { EventoService } from 'src/evento/evento.service';
import CalculoEstadual from 'src/calculo_diarias/estadual';
import CalculoNacional from 'src/calculo_diarias/externo';
import CalculoInternacional from 'src/calculo_diarias/internacional';
import { Municipios } from 'src/calculo_diarias/diarias-enum';
import { Util } from 'src/util/Util';


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
  ) { }

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

  async calculaDiaria(idViagem: number, participanteId: number, eventoId: number, total: number) {
    const localizaEvento = await this.eventoService.findOne(eventoId);
    const localizaViagem = await this.findOne(idViagem);
    const localizaEventoParticipante = await this.eventoParticipanteService.findOne(+participanteId);
    const localizaCidade = await this.localizaCidadeOuAeroporto(localizaViagem.cidade_destino_id, localizaViagem.destino_id);

    const cargo = await this.consultaCargo(participanteId);

    const parametros: any = {
      viagem: localizaViagem,
      evento: localizaEvento,
      participante: localizaEventoParticipante,
      cargo: cargo,
      localizaCidade: localizaCidade,
      total: total,
    };

    return (
      (await this.destinoMacapa(parametros)) ||
      (await this.destinoEstadual(parametros)) ||
      (await this.destinoNacional(parametros)) ||
      (await this.destinoInternacional(parametros))
    );
  }

  async localizaCidadeOuAeroporto(cidadeId: number, aeroportoId: number) {
    return cidadeId === null ? await this.aeroportoService.findOne(aeroportoId) : await this.cidadeService.findOne(cidadeId);
  }

  async destinoEstadual(parametros: any) {
    const evento = parametros.evento as evento;

    if (evento.tem_passagem === 'NAO' && parametros.localizaCidade.descricao !== Municipios.MACAPA) {
      const calculo = await this.cargoDiariaService.findDiariasPorCargo(parametros.cargo);

      const uf = parametros.localizaCidade.estado.uf;
      const viagem = parametros.viagem;
      const cidade = parametros.viagem.cidade_destino.descricao;

      const calculoEstadual = new CalculoEstadual();
      const estatual = calculoEstadual.servidores(viagem, uf, cidade, calculo.valor_diarias, evento, parametros.total);

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

    if (evento.tem_passagem === 'SIM' && evento.exterior === 'NAO') {
      const aeroporto = await this.aeroportoService.findOne(parametros.viagem.destino_id);
      const uf = aeroporto.uf;

      const calculo = await this.cargoDiariaService.findDiariasPorCargo(parametros.cargo);

      const calculoNacional = new CalculoNacional();
      const nacional = calculoNacional.servidores(parametros.viagem, uf, calculo.valor_diarias, evento, evento.tem_passagem, parametros.total);

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

  async destinoInternacional(parametros: any) {
    const evento = parametros.evento as evento;

    if (evento.tem_passagem === 'SIM' && evento.exterior === 'SIM') {
      const calculo = await this.cargoDiariaService.findDiariasPorCargo(parametros.cargo);

      const internacional = new CalculoInternacional();
      const resultadoCalculoInternacional = internacional.servidores(
        parametros.viagem,
        calculo.valor_diarias,
        evento,
        parametros.total
      );
      const inteira = internacional.valorNacional(parametros.viagem, calculo.valor_diarias);

      await this.salvaDiariaInternacional(parametros, resultadoCalculoInternacional);
      await this.salvaDiariaInteira(parametros, inteira);


      return resultadoCalculoInternacional;
    }
    return 0;
  }

  async salvaDiariaInternacional(parametros: any, resultadoCalculoInternacional: number) {
    const valorViagemInternacional: CreateValorViagemDto = {
      viagem_id: parametros.viagem.id,
      tipo: 'DIARIA',
      destino: 'INTERNACIONAL',
      valor_individual: resultadoCalculoInternacional,
    };
    this.valorViagemService.create(valorViagemInternacional);
  }

  async salvaDiariaInteira(parametros: any, inteira: number) {
    const valorViagem: CreateValorViagemDto = {
      viagem_id: parametros.viagem.id,
      tipo: 'DIARIA',
      destino: 'NACIONAL',
      valor_individual: inteira,
    };
    this.valorViagemService.create(valorViagem);
  }

  async destinoMacapa(parametros: any) {
    if (parametros.temPassagem === 'NAO') {
      try {
        const localizaCidade = await this.cidadeService.findOne(parametros.viagem.localizaViagem.cidade_destino_id);

        if (localizaCidade.estado.uf === 'AP' && localizaCidade.descricao === 'Macapá') {
          return null;
        }
      } catch (error) {
        console.error('Ocorreu um erro ao buscar informações da viagem ou da cidade:', error);
        throw error;
      }
    }
    return 0;
  }


  calculaDiasParaDiaria(solicitacao_id: number): Promise<ParticipanteTotalDias[]> {
    ""
    return this.prisma.evento
      .findMany({
        where: {
          solicitacao_id: solicitacao_id,
        },
        include: {
          evento_participantes: {
            include: {
              viagem_participantes: true,
              participante: true,

            },
          },
        },
      })
      .then((result) => {
        const participantes: ParticipanteTotalDias[] = [];
        let somaDias = 0;

        const eventosSort = result.sort((a, b) => a.inicio.getTime() - b.inicio.getTime());

        eventosSort.forEach((eventos) => {
          eventos.evento_participantes
            .filter((ep) => eventos.id === ep.evento_id)
            .forEach((p) => {
              const participante = participantes.find((next) => next.participante.cpf === p.participante.cpf);

              const viagem = p.viagem_participantes.find((next) => next.evento_participantes_id === p.id);

              //SÓ DEVE CALCULAR DIÁRIAS SE TIVER VIAGEM
              if (participante === undefined) {

                const diferencaEntreEventos = this.calcularDiferencaEntreEventos(eventosSort);
                //console.log("Diferença em dias entre os eventos:", diferencaEntreEventos);

                if(diferencaEntreEventos.length > 0){
                  somaDias = diferencaEntreEventos[0];
                } 
                
                const total = somaDias-1;

                participantes.push({
                  participante: p.participante,
                  totalDias: Util.totalDeDias(eventos.inicio, eventos.fim)+total,
                  evento: eventos,
                  viagem: viagem.viagem_id === undefined ? 0 : viagem.viagem_id,
                });
              } else {
                participante.totalDias += Util.totalDeDias(eventos.inicio, eventos.fim);
              }
            });
        });

        return participantes;
      });
  }

  calcularDiferencaEntreEventos(eventos: { inicio: Date, fim: Date }[]): number[] {
    const diferencas: number[] = [];
    for (let i = 0; i < eventos.length - 1; i++) {
        const fimEventoAtual = eventos[i].fim;
        const inicioProximoEvento = eventos[i + 1].inicio;
        const diferencaEmDias = this.calcularDiferencaEmDias(fimEventoAtual, inicioProximoEvento);
        diferencas.push(diferencaEmDias);
    }
    return diferencas;
}

  calcularDiferencaEmDias(dataInicio: Date, dataFim: Date): number {
    const umDiaEmMilissegundos = 1000 * 60 * 60 * 24;
    const diferencaEmMilissegundos = dataFim.getTime() - dataInicio.getTime();
    return Math.floor(diferencaEmMilissegundos / umDiaEmMilissegundos);
}

  async consultaCargo(participanteId: number): Promise<string> {
    const localizaEventoParticipante = await this.eventoParticipanteService.findOneParticipante(+participanteId);
    const funcao = localizaEventoParticipante.funcao;
    let cargo = localizaEventoParticipante.cargo;
    const efetivo = localizaEventoParticipante.efetivo;

    if (efetivo.trim() === 'SERVIDORES EFETIVOS' && funcao !== '') {
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

  findViagemPorSolicitacaoId(id: number, eventoId: number) {
    /* return this.prisma.viagem.findFirst({
      where: {
        solicitacao_id: id,
      }
    }); */

    return this.prisma.evento_participantes.findFirst({
      where: {
        participante_id: +id,
        evento_id: +eventoId,
      },
      include: {
        viagem_participantes: {
          include: {
            viagem: true,
          }
        }
      }
    })
  }

  findViagemPorSolicitacao(id: number) {
    return this.prisma.viagem_participantes.findMany({

      where: {
        OR: [
          {
            viagem: {
              solicitacao_id: id
            },
          },
          { evento_participantes: { evento: {
            solicitacao_id: id
          } } },
        ],
        /* viagem: {
          solicitacao_id: id
        } */
      },
      
      include: {        
        viagem: {
          include: {
            valor_viagem: true,
            origem: true,
            destino: true,
            cidade_destino: {
              include: {
                estado: true
              }
            },
            cidade_origem: {
              include: {
                estado: true
              }
            },

          }
        },
        evento_participantes: {
          include:{
            participante: true,
            evento: true,
          }
        }


       /*  viagem_participantes: {
          include: {
            viagem: {
              include: {
                viagem_participantes: {
                  include: {
                    evento_participantes: {
                      include: {
                        participante: true
                      }
                    }
                  }
                },
                valor_viagem: true
              }
            },
          }
        }
      } */
    }
  })
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

//async cadastraValoresDaDiaria(idViagem: number, idEventoParticipante: number, eventoId: number){    

type ParticipanteTotalDias = {
  participante: participante;
  totalDias: number;
  evento: evento;
  viagem: number;
};
