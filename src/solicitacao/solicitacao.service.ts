import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Operacao } from 'src/log_sistema/log_enum';
import { InfoUsuario, LogSistemaService } from 'src/log_sistema/log_sistema.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import PesquisaSolicitacaoDTO from './dto/pesquisa-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { ConsultaSetoresDto } from './dto/consulta-setores.dto';
import { Solicitacao } from './entities/solicitacao.entity';
import { ValorDiariasDto } from './dto/valor-diarias.dto';
import { EventoParticipanteDto } from './dto/evento-participante.dto';
import { DiariasResponseDto } from './dto/response.dto';
import { ParticipanteIdDto } from './dto/participante-id.dto';

@Injectable()
export class SolicitacaoService {

  private readonly logger = new Logger(SolicitacaoService.name);


  constructor(private prisma: PrismaService, private logSistemaService: LogSistemaService) {}

  async create(dto: CreateSolicitacaoDto, usuario: InfoUsuario): Promise<CreateSolicitacaoDto> {
    this.logSistemaService.createLog(dto, usuario, Operacao.INSERT);

    return this.prisma.solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.solicitacao.findMany({
      orderBy: [{ id: 'desc' }],
    });
  }

  findSolicitacoesDeAcordoComSetor(consulta: ConsultaSetoresDto) {
    const resultado = this.prisma.solicitacao.findMany({
      where: {
        datareg: {
          gte: new Date(consulta.dataInicio),
          lte: new Date(consulta.dataFim),
        },

        cod_lotacao: {
          in: consulta.ids,
        },
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });

    const todos = this.prisma.solicitacao.findMany({
      where: {
        cod_lotacao: {
          in: consulta.ids,
        },
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });

    if (consulta.dataInicio && consulta.dataFim) {
      return resultado;
    } else {
      return todos;
    }
  }

  findOne(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      },
      include: {
        empenho_daofi: true,
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        eventos: {
          include: {
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        valor_viagem: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  findAllByLogin(login: string) {
    return this.prisma.solicitacao.findMany({
      where: {
        login: login,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findAllByLotacao(codLotacao: number) {
    return this.prisma.solicitacao.findMany({
      where: {
        cod_lotacao: codLotacao,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  pesquisarSolicitacaoPorNumero(numero: number) {
    return this.prisma.solicitacao.findMany({
      where: {
        id: numero
      },
      include: {
        tramite: true,
        correcao_solicitacao: true,
        empenho_daofi: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
    });
  }

  detalhesDaSolicitacao(id: number) {
    return this.prisma.solicitacao.findUnique({
      where: {
        id: id,
      },
      include: {
        tramite: {
          include: {
            log_tramite: true,
          },
        },
        empenho_daofi: true,
        correcao_solicitacao: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
    });
  }

  pesquisarSolicitacoes(dto: PesquisaSolicitacaoDTO) {
    return this.prisma.solicitacao.findMany({
      where: {
        AND: [
          {
            cpf_responsavel: dto?.cpf_responsavel,
            cod_lotacao: dto?.cod_lotacao,
          },

          {
            datareg: {
              gte: new Date(dto.dataInicio),
              lte: new Date(dto.dataFim),
            },
          },
          {
            tramite: {
              some: {
                status: dto.status,
              },
            },
          },
        ],

        /* OR: [
          {
            tramite: {
              every: {
                status: dto.status
              }
            }
          }
        ] */
      },
      include: {
        tramite: true,
        correcao_solicitacao: true,
        empenho_daofi: true,
        eventos: {
          include: {
            anexo_evento: true,
            evento_participantes: {
              include: {
                participante: {
                  include: {
                    conta_diaria: {
                      include: {
                        banco: true,
                      },
                    },
                  },
                },
                viagem_participantes: {
                  include: {
                    viagem: {
                      include: {
                        origem: true,
                        destino: true,
                        pais: true,
                        valor_viagem: true,
                        cidade_origem: {
                          include: {
                            estado: true,
                          },
                        },
                        cidade_destino: {
                          include: {
                            estado: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            cidade: {
              include: {
                estado: true,
              },
            },
            pais: true,
          },
        },
      },
    });
  }

  pesquisarResponsaveis() {
    return this.prisma.solicitacao.findMany({
      distinct: ['nome_responsavel'],
      orderBy: [{ nome_responsavel: 'asc' }],
    });
  }

  async update(id: number, updateSolicitacaoDto: UpdateSolicitacaoDto, usuario: InfoUsuario) {
    this.logSistemaService.createLog(updateSolicitacaoDto, usuario, Operacao.UPDATE);

    if (updateSolicitacaoDto.status === 'PDF_GERADO') {
      return this.prisma.solicitacao.update({
        where: { id },
        data: {
          status: 'PDF_GERADO',
          protocolo: updateSolicitacaoDto.protocolo          
        },
      });
    }

    return this.prisma.solicitacao.update({
      where: { id },
      data: {
        justificativa: updateSolicitacaoDto.justificativa,
      },
    });
  }

  async remove(id: number, usuario: InfoUsuario) {
    const copia = await this.findOne(id);

    await this.logSistemaService.createLog(copia, usuario, Operacao.DELETE);

    /* const resultado = await this.prisma.solicitacao.delete({
      where: {
        id: id,
      },
    }); */

    const result = await this.removerDadosPorSolicitacao(id);

    return result;
  }

  async removerDadosPorSolicitacao(solicitacaoId: number) {
    try {
      const result = await this.prisma.$executeRaw`SELECT remover_geral_darad(${solicitacaoId}::INTEGER)`;
      //console.log(result);
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async removeDARAD(id: number, usuario: InfoUsuario) {
    const copia = await this.findOne(id);

    await this.logSistemaService.createLog(copia, usuario, Operacao.DELETE);

    const result = await this.removerDadosPorSolicitacaoDARAD(id);

    return result;
  }

  async removerDadosPorSolicitacaoDARAD(solicitacaoId: number) {
    try {
      const result = await this.prisma.$executeRaw`SELECT remover_geral_darad(${solicitacaoId}::INTEGER)`;
    } catch (error) {
      console.error('Erro ao executar a função:', error);
    } finally {
      await this.prisma.$disconnect();
    }
  }

  async getSolicitacoesTransparencia(page: number, limit: number): Promise<Solicitacao[]> {
    const skip = (page - 1) * limit;
    return this.prisma.solicitacao.findMany({
      skip: +skip,
      take: +limit,
      orderBy: {
        datareg: 'desc',
      },
      where: {
        status: 'PDF_GERADO',
      },
      
      select: {
        id: true,
        eventos: {
          select: {
            titulo: true,
            evento_participantes: {
               select: {
                participante: {
                  select: {
                    nome: true,
                    cargo: true,
                  }
                },
                viagem_participantes: {
                  select: {
                    viagem: {
                      select: {                      
                        data_ida: true,
                        data_volta: true,
                        valor_viagem: {
                          orderBy: {
                            id: 'desc',
                          },
                          take: 1,
                          select: {
                            valor_individual: true,
                            valor_grupo: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            tipo_evento: true,
            
          },
        },
      },
      
      
    }
    

      
   );
  }


  async getSolicitacoesCount(): Promise<number> {
    return this.prisma.solicitacao.findMany({
      where: {
        status: 'PDF_GERADO'
      },
    }).then((solicitacoes) => {
      return solicitacoes.length;
    });
  }

  ///testandooooo

  /* async getEventosParticipante(solicitacaoId: number, participanteId: number): Promise<DiariasResponseDto> {
    try {
      // Buscar os eventos do participante na solicitação
      // Use explicit parameter casting to fix type mismatch
      const eventos = await this.prisma.$queryRaw<EventoParticipanteDto[]>`
        SELECT 
          e.id as evento_id,
          e.titulo,
          e.inicio,
          e.fim,
          e.tem_passagem,
          e.exterior,
          te.descricao as tipo_evento,
          p.nome_pt as pais,
          c.descricao as cidade,
          e.valor_evento,
          pa.id as participante_id,
          pa.nome as participante_nome,
          pa.cpf as participante_cpf,
          pa.data_nascimento,
          pa.matricula as participante_matricula,
          pa.cargo as participante_cargo,
          pa.email as participante_email,
          pa.telefone as participante_telefone
        FROM evento e
        INNER JOIN evento_participantes ep ON e.id = ep.evento_id
        INNER JOIN participante pa ON ep.participante_id = pa.id
        INNER JOIN tipo_evento te ON e.tipo_evento_id = te.id
        INNER JOIN pais p ON e.pais_id = p.id
        LEFT JOIN cidade c ON e.cidade_id = c.id
        WHERE e.solicitacao_id = ${solicitacaoId}::int
        AND pa.id = ${participanteId}::int
        ORDER BY e.inicio ASC
      `;

      if (!eventos || eventos.length === 0) {
        throw new NotFoundException('Nenhum evento encontrado para este participante nesta solicitação');
      }

      // Calcular as datas e totais
      const dataPrimeiroEvento = eventos.reduce(
        (min, e) => (e.inicio < min ? e.inicio : min),
        eventos[0].inicio
      );

      const dataUltimoEvento = eventos.reduce(
        (max, e) => (e.fim > max ? e.fim : max),
        eventos[0].fim
      );

      // Calcular total de dias (considerando que o Rust usa signed_duration_since + 1)
      const totalDias = Math.floor(
        (dataUltimoEvento.getTime() - dataPrimeiroEvento.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
      
      const totalEventos = eventos.length;
      const primeiroEvento = eventos[0];

      // Buscar valores das diárias por cargo
      let valoresDiarias: ValorDiariasDto | null = null;
      if (primeiroEvento.participante_cargo) {
        valoresDiarias = await this.getValorDiariasByCargo(primeiroEvento.participante_cargo.trim());
      }

      // Calcular valor da diária
      const valorDiaria = valoresDiarias 
        ? this.calculaValores(totalDias, primeiroEvento.tem_passagem, primeiroEvento.exterior, valoresDiarias)
        : 0;

      return {
        analise: {
          participante_nome: primeiroEvento.participante_nome,
          participante_cpf: primeiroEvento.participante_cpf,
          eventos,
          data_primeiro_evento: dataPrimeiroEvento,
          data_ultimo_evento: dataUltimoEvento,
          total_dias: totalDias,
          total_eventos: totalEventos
        },
        valores_diarias: valoresDiarias,
        valor_diaria: valorDiaria
      };
    } catch (error) {
      this.logger.error(`Erro ao buscar eventos: ${error.message}`, error.stack);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar eventos');
    }
  }

  async getValorDiariasByCargo(cargo: string): Promise<ValorDiariasDto | null> {
    try {
      // Fix type mismatch here as well - comparing string with text column
      const result = await this.prisma.$queryRaw<ValorDiariasDto[]>`
        SELECT 
          cd.cargo,
          vd.dentro,
          vd.fora,
          vd.internacional
        FROM cargo_diarias cd
        INNER JOIN valor_diarias vd ON cd.valor_diarias_id = vd.id
        WHERE cd.cargo = ${cargo}::text
      `;

      return result.length > 0 ? result[0] : null;
    } catch (error) {
      this.logger.error(`Erro ao buscar valores das diárias: ${error.message}`, error.stack);
      return null;
    }
  }

  calculaValores(totalDias: number, temPassagem: string, exterior: string, valoresDiarias: ValorDiariasDto): number {
    if (temPassagem === 'SIM') {
      const calcula = valoresDiarias.fora * totalDias;
      return calcula + (valoresDiarias.fora / 2.0);
    } else if (exterior === 'SIM') {
      const calcula = valoresDiarias.internacional * totalDias;
      return calcula + (valoresDiarias.internacional / 2.0);
    } else {
      return valoresDiarias.dentro * totalDias;
    }
  } */

    
    async getEventosParticipante(solicitacaoId: number, participanteId: number): Promise<DiariasResponseDto> {
      try {
        // Buscar os eventos do participante na solicitação
        const eventos = await this.prisma.$queryRaw<EventoParticipanteDto[]>`
          SELECT 
            e.id as evento_id,
            e.titulo,
            e.inicio,
            e.fim,
            e.tem_passagem,
            e.exterior,
            te.descricao as tipo_evento,
            p.nome_pt as pais,
            c.descricao as cidade,
            e.valor_evento,
            pa.id as participante_id,
            pa.nome as participante_nome,
            pa.cpf as participante_cpf,
            pa.data_nascimento,
            pa.matricula as participante_matricula,
            pa.cargo as participante_cargo,
            pa.email as participante_email,
            pa.telefone as participante_telefone
          FROM evento e
          INNER JOIN evento_participantes ep ON e.id = ep.evento_id
          INNER JOIN participante pa ON ep.participante_id = pa.id
          INNER JOIN tipo_evento te ON e.tipo_evento_id = te.id
          INNER JOIN pais p ON e.pais_id = p.id
          LEFT JOIN cidade c ON e.cidade_id = c.id
          WHERE e.solicitacao_id = ${solicitacaoId}::int
          AND pa.id = ${participanteId}::int
          ORDER BY e.inicio ASC
        `;
  
        if (!eventos || eventos.length === 0) {
          throw new NotFoundException('Nenhum evento encontrado para este participante nesta solicitação');
        }
  
        return this.processEventosParticipante(eventos);
      } catch (error) {
        this.logger.error(`Erro ao buscar eventos: ${error.message}`, error.stack);
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Erro ao buscar eventos');
      }
    }
  
    async getDiariasBySolicitacao(solicitacaoId: number): Promise<DiariasResponseDto[]> {
      try {
        // Primeiro obtém todos os participantes únicos desta solicitação
        const participantes = await this.prisma.$queryRaw<ParticipanteIdDto[]>`
          SELECT DISTINCT 
            pa.id as participante_id
          FROM evento e
          INNER JOIN evento_participantes ep ON e.id = ep.evento_id
          INNER JOIN participante pa ON ep.participante_id = pa.id
          WHERE e.solicitacao_id = ${solicitacaoId}::int
        `;
  
        if (!participantes || participantes.length === 0) {
          throw new NotFoundException('Nenhum participante encontrado para esta solicitação');
        }
  
        // Processa cada participante e calcula suas diárias
        const resultados: DiariasResponseDto[] = [];
  
        for (const participante of participantes) {
          try {
            const resultado = await this.getEventosParticipante(solicitacaoId, participante.participante_id);
            resultados.push(resultado);
          } catch (error) {
            // Log do erro mas continua processando os outros participantes
            this.logger.error(`Erro ao processar participante ${participante.participante_id}: ${error.message}`);
          }
        }
  
        if (resultados.length === 0) {
          throw new NotFoundException('Não foi possível calcular diárias para nenhum participante desta solicitação');
        }
  
        return resultados;
      } catch (error) {
        this.logger.error(`Erro ao processar solicitação: ${error.message}`, error.stack);
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw new InternalServerErrorException('Erro ao processar solicitação');
      }
    }
  
    /* private async processEventosParticipante(eventos: EventoParticipanteDto[]): Promise<DiariasResponseDto> {
      // Calcular as datas e totais
      const dataPrimeiroEvento = eventos.reduce(
        (min, e) => (e.inicio < min ? e.inicio : min),
        eventos[0].inicio
      );
  
      const dataUltimoEvento = eventos.reduce(
        (max, e) => (e.fim > max ? e.fim : max),
        eventos[0].fim
      );
  
      // Conjunto para armazenar dias únicos
      const diasUnicos = new Set<string>();
      
      // Para cada evento, adicionar todos os dias do evento ao conjunto
      eventos.forEach(evento => {
        const dataInicio = new Date(evento.inicio);
        const dataFim = new Date(evento.fim);
        
        // Percorrer cada dia do evento
        const diaAtual = new Date(dataInicio);
        while (diaAtual <= dataFim) {
          // Adicionar o dia ao conjunto (formato ISO simplificado para data)
          diasUnicos.add(diaAtual.toISOString().split('T')[0]);
          // Avançar para o próximo dia
          diaAtual.setDate(diaAtual.getDate() + 1);
        }
      });
      
      // Total de dias únicos (sem duplicações por sobreposições)
      const totalDias = diasUnicos.size;
      const totalEventos = eventos.length;
      const primeiroEvento = eventos[0];
  
      // Buscar valores das diárias por cargo
      let valoresDiarias: ValorDiariasDto | null = null;
      if (primeiroEvento.participante_cargo) {
        this.logger.log(`Cargo do participante encontrado: "${primeiroEvento.participante_cargo}"`);
        valoresDiarias = await this.getValorDiariasByCargo(primeiroEvento.participante_cargo.trim());
      } else {
        this.logger.warn(`Participante ${primeiroEvento.participante_nome} (ID: ${primeiroEvento.participante_id}) não possui cargo definido`);
      }
  
      // Calcular valor da diária com a nova lógica
      let valorDiaria = 0;
      if (valoresDiarias) {
        valorDiaria = this.calculaValoresMelhorado(
          totalDias, 
          primeiroEvento.tem_passagem, 
          primeiroEvento.exterior, 
          valoresDiarias
        );
      } else {
        this.logger.warn(`Não foi possível calcular diárias para o participante ${primeiroEvento.participante_nome} pois não foram encontrados valores de diárias para seu cargo`);
      }
  
      const diasArray = Array.from(diasUnicos).sort();
      this.logger.log(`Dias únicos para o participante ${primeiroEvento.participante_nome}: ${diasArray.join(', ')} (total: ${totalDias} dias)`);
  
      return {
        analise: {
          participante_nome: primeiroEvento.participante_nome,
          participante_cpf: primeiroEvento.participante_cpf,
          eventos,
          data_primeiro_evento: dataPrimeiroEvento,
          data_ultimo_evento: dataUltimoEvento,
          total_dias: totalDias,
          total_eventos: totalEventos
        },
        valores_diarias: valoresDiarias,
        valor_diaria: valorDiaria
      };
    } */

      private async processEventosParticipante(eventos: EventoParticipanteDto[]): Promise<DiariasResponseDto> {
        // Calcular as datas e totais
        const dataPrimeiroEvento = eventos.reduce(
          (min, e) => (e.inicio < min ? e.inicio : min),
          eventos[0].inicio
        );
      
        const dataUltimoEvento = eventos.reduce(
          (max, e) => (e.fim > max ? e.fim : max),
          eventos[0].fim
        );
      
        // Conjunto para armazenar dias únicos
        const diasUnicos = new Set<string>();
        
        // Para cada evento, adicionar todos os dias do evento ao conjunto
        eventos.forEach(evento => {
          const dataInicio = new Date(evento.inicio);
          const dataFim = new Date(evento.fim);
          
          // Percorrer cada dia do evento
          const diaAtual = new Date(dataInicio);
          while (diaAtual <= dataFim) {
            // Adicionar o dia ao conjunto (formato ISO simplificado para data)
            diasUnicos.add(diaAtual.toISOString().split('T')[0]);
            // Avançar para o próximo dia
            diaAtual.setDate(diaAtual.getDate() + 1);
          }
        });
        
        // Total de dias únicos (sem duplicações por sobreposições)
        const totalDias = diasUnicos.size;
        const totalEventos = eventos.length;
        const primeiroEvento = eventos[0];
      
        // Buscar valores das diárias por cargo
        let valoresDiarias: ValorDiariasDto | null = null;
        if (primeiroEvento.participante_cargo) {
          this.logger.log(`Cargo do participante encontrado: "${primeiroEvento.participante_cargo}"`);
          valoresDiarias = await this.getValorDiariasByCargo(primeiroEvento.participante_cargo.trim());
        } else {
          this.logger.warn(`Participante ${primeiroEvento.participante_nome} (ID: ${primeiroEvento.participante_id}) não possui cargo definido`);
        }
      
        // Calcular valor da diária com lógica de múltiplos eventos
        let valorDiaria = 0;
        if (valoresDiarias) {
          // Verificamos se há múltiplos eventos ou apenas um
          if (totalEventos > 1) {
            // Múltiplos eventos: usamos total de dias únicos + meia diária
            valorDiaria = this.calculaDiariasMultiplosEventos(
              totalDias,
              eventos, // Passamos todos os eventos para analisar cada um
              valoresDiarias
            );
          } else {
            // Evento único: mantemos o cálculo atual
            valorDiaria = this.calculaValoresMelhorado(
              totalDias, 
              primeiroEvento.tem_passagem, 
              primeiroEvento.exterior, 
              valoresDiarias
            );
          }
        } else {
          this.logger.warn(`Não foi possível calcular diárias para o participante ${primeiroEvento.participante_nome} pois não foram encontrados valores de diárias para seu cargo`);
        }
      
        const diasArray = Array.from(diasUnicos).sort();
        this.logger.log(`Dias únicos para o participante ${primeiroEvento.participante_nome}: ${diasArray.join(', ')} (total: ${totalDias} dias)`);
      
        return {
          analise: {
            participante_nome: primeiroEvento.participante_nome,
            participante_cpf: primeiroEvento.participante_cpf,
            eventos,
            data_primeiro_evento: dataPrimeiroEvento,
            data_ultimo_evento: dataUltimoEvento,
            total_dias: totalDias,
            total_eventos: totalEventos
          },
          valores_diarias: valoresDiarias,
          valor_diaria: valorDiaria
        };
      }

      private calculaDiariasMultiplosEventos(
        totalDias: number, 
        eventos: EventoParticipanteDto[], 
        valoresDiarias: ValorDiariasDto
      ): number {
        // Mapeamos cada dia único para o evento correspondente
        const mapaDiasEventos = new Map<string, EventoParticipanteDto>();
        
        // Para cada evento, adicionamos seus dias ao mapa
        // Se um dia já existe no mapa (está em mais de um evento),
        // priorizamos eventos internacionais > com passagem > local
        eventos.forEach(evento => {
          const dataInicio = new Date(evento.inicio);
          const dataFim = new Date(evento.fim);
          
          const diaAtual = new Date(dataInicio);
          while (diaAtual <= dataFim) {
            const diaStr = diaAtual.toISOString().split('T')[0];
            
            // Se o dia já está no mapa, verificamos a prioridade
            if (mapaDiasEventos.has(diaStr)) {
              const eventoExistente = mapaDiasEventos.get(diaStr);
              
              // Prioridade: internacional > com passagem > local
              if (evento.exterior === 'SIM' && eventoExistente.exterior !== 'SIM') {
                // Evento atual é internacional e o existente não
                mapaDiasEventos.set(diaStr, evento);
              } else if (evento.tem_passagem === 'SIM' && eventoExistente.tem_passagem !== 'SIM' && 
                        eventoExistente.exterior !== 'SIM') {
                // Evento atual tem passagem, o existente não, e o existente não é internacional
                mapaDiasEventos.set(diaStr, evento);
              }
              // Nos outros casos, mantém o evento já registrado
            } else {
              // Dia ainda não está no mapa, então o adicionamos
              mapaDiasEventos.set(diaStr, evento);
            }
            
            // Avançar para o próximo dia
            diaAtual.setDate(diaAtual.getDate() + 1);
          }
        });
        
        // Agora calculamos o valor total somando as diárias para cada dia
        // de acordo com o tipo de evento de cada dia
        let valorTotal = 0;
        
        // Contamos quantos dias de cada tipo temos
        let diasDentro = 0;
        let diasFora = 0;
        let diasInternacional = 0;
        
        // Iteramos sobre todos os dias únicos
        mapaDiasEventos.forEach((evento, dia) => {
          if (evento.exterior === 'SIM') {
            diasInternacional++;
          } else if (evento.tem_passagem === 'SIM') {
            diasFora++;
          } else {
            diasDentro++;
          }
        });
        
        // Calculamos o valor total de cada tipo
        const valorDentro = diasDentro * valoresDiarias.dentro;
        const valorFora = diasFora * valoresDiarias.fora;
        const valorInternacional = diasInternacional * valoresDiarias.internacional;
        
        // Somamos os valores
        valorTotal = valorDentro + valorFora + valorInternacional;
        
        this.logger.log(`Cálculo para múltiplos eventos:
          Dias local: ${diasDentro} x ${valoresDiarias.dentro} = ${valorDentro}
          Dias com passagem: ${diasFora} x ${valoresDiarias.fora} = ${valorFora}
          Dias internacional: ${diasInternacional} x ${valoresDiarias.internacional} = ${valorInternacional}
          Subtotal: ${valorTotal}`);
        
        // Adicionamos meia diária extra baseada no valor mais alto (internacional > fora > dentro)
        let valorMeiaDiaria = 0;
        if (diasInternacional > 0) {
          valorMeiaDiaria = valoresDiarias.internacional / 2;
          this.logger.log(`Meia diária adicional: ${valorMeiaDiaria} (internacional)`);
        } else if (diasFora > 0) {
          valorMeiaDiaria = valoresDiarias.fora / 2;
          this.logger.log(`Meia diária adicional: ${valorMeiaDiaria} (fora)`);
        } else {
          valorMeiaDiaria = valoresDiarias.dentro / 2;
          this.logger.log(`Meia diária adicional: ${valorMeiaDiaria} (dentro)`);
        }
        
        // Valor final com meia diária
        this.logger.log(`Valor total: ${valorTotal} + ${valorMeiaDiaria} = ${valorTotal + valorMeiaDiaria}`);
        
        return valorTotal + valorMeiaDiaria;
      }
      
  
    async getValorDiariasByCargo(cargo: string): Promise<ValorDiariasDto | null> {
      try {
        this.logger.log(`Buscando valores de diárias para o cargo: "${cargo}"`);
        
        const result = await this.prisma.$queryRaw<ValorDiariasDto[]>`
          SELECT 
            cd.cargo,
            vd.dentro,
            vd.fora,
            vd.internacional
          FROM cargo_diarias cd
          INNER JOIN valor_diarias vd ON cd.valor_diarias_id = vd.id
          WHERE TRIM(LOWER(cd.cargo)) = TRIM(LOWER(${cargo}::text))
        `;
  
        if (result.length > 0) {
          this.logger.log(`Valores de diárias encontrados para o cargo "${cargo}": ${JSON.stringify(result[0])}`);
          return result[0];
        } else {
          this.logger.warn(`Não foram encontrados valores de diárias para o cargo: "${cargo}"`);
          return null;
        }
      } catch (error) {
        this.logger.error(`Erro ao buscar valores das diárias para o cargo "${cargo}": ${error.message}`, error.stack);
        return null;
      }
    }
  
    /**
     * Calcula os valores das diárias com base na nova lógica:
     * 1. Aplicar o valor apropriado para cada dia único
     * 2. Adicionar meia diária no final (apenas uma vez)
     * 
     * Lógica de seleção da diária:
     * - Se tiver viagem: usar valor "fora"
     * - Se for externo: usar valor "internacional"
     * - Caso contrário: usar valor "dentro"
     */
    calculaValoresMelhorado(totalDias: number, temPassagem: string, exterior: string, valoresDiarias: ValorDiariasDto): number {
      let valorDiariaPorDia: number;
  
      // Determinar qual valor de diária aplicar por dia
      if (temPassagem === 'SIM') {
        // Se tiver viagem, usar o valor "fora"
        valorDiariaPorDia = valoresDiarias.fora;
        this.logger.log('Aplicando valor de diária FORA (com viagem)');
      } else if (exterior === 'SIM') {
        // Se for no exterior, usar o valor "internacional"
        valorDiariaPorDia = valoresDiarias.internacional;
        this.logger.log('Aplicando valor de diária INTERNACIONAL');
      } else {
        // Caso contrário, usar o valor "dentro"
        valorDiariaPorDia = valoresDiarias.dentro;
        this.logger.log('Aplicando valor de diária DENTRO (sem viagem)');
      }
  
      // Calcular valor base para todos os dias
      const valorBase = valorDiariaPorDia * totalDias;
      
      // Adicionar meia diária extra (apenas uma vez)
      const meiaDiaria = valorDiariaPorDia / 2.0;
      
      this.logger.log(`Cálculo: ${valorDiariaPorDia} × ${totalDias} dias + ${meiaDiaria} (meia diária) = ${valorBase + meiaDiaria}`);
      
      return valorBase + meiaDiaria;
    }
  
    // Mantendo o método original para compatibilidade, caso seja necessário
    calculaValores(totalDias: number, temPassagem: string, exterior: string, valoresDiarias: ValorDiariasDto): number {
      // Mesma lógica do método melhorado, para manter consistência
      let valorDiariaPorDia: number;
  
      if (temPassagem === 'SIM') {
        valorDiariaPorDia = valoresDiarias.fora;
      } else if (exterior === 'SIM') {
        valorDiariaPorDia = valoresDiarias.internacional;
      } else {
        valorDiariaPorDia = valoresDiarias.dentro;
      }
  
      const valorBase = valorDiariaPorDia * totalDias;
      const meiaDiaria = valorDiariaPorDia / 2.0;
      
      return valorBase + meiaDiaria;
    }



}

  /* async getDadosTransparencia(page: number, limit: number): Promise<DadosTransparencia[]> {
    const solicitacoes = await this.getSolicitacoesTransparencia(page, limit);
  
    return solicitacoes.map(solicitacao => {
      const participante = solicitacao.eventos?.[0]?.evento_participantes?.[0]?.participante;
      const viagem = solicitacao.eventos?.[0]?.evento_participantes?.[0]?.viagem_participantes?.[0]?.viagem;
      const diarias = viagem?.valor_viagem || [];
      const valorTotalDiariaRecebido = diarias.reduce((total, diaria) => total + diaria.valor, 0);
      const numeroDiariasUsufruidas = diarias.length;
      const periodoAfastamento = viagem ? `${viagem.dataInicio} a ${viagem.dataVolta}` : '';
      const motivoAfastamento = viagem?.motivo || '';
  
      return {
        nomeBeneficiario: participante?.nome || '',
        cargoFuncao: participante?.cargo || '',
        valorTotalDiariaRecebido,
        numeroDiariasUsufruidas,
        periodoAfastamento,
        motivoAfastamento,
      };
    });
  }  
} */




/* type DadosTransparencia = {
  nomeBeneficiario: string;
  cargoFuncao: string;
  valorTotalDiariaRecebido: number;
  numeroDiariasUsufruidas: number;
  periodoAfastamento: string;
  motivoAfastamento: string;
}; */