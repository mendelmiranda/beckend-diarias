import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { CreateValorViagemDto } from './dto/create-valor_viagem.dto';
import { UpdateValorViagemDto } from './dto/update-valor_viagem.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { ParticipanteDiariaDto } from './dto/participantes-diarias.dto';

@Injectable()
export class ValorViagemService {

  private readonly logger = new Logger(ValorViagemService.name);

  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateValorViagemDto) {
    return this.prisma.valor_viagem.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all valorViagem`;
  }

  findValorDaViagem(id: number) {
    return this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: id,
        tipo: 'PASSAGEM'
      }
    });
  }

  findValorDaDiariaColaborador(id: number) {
    return this.prisma.valor_viagem.findMany({
      where: {
        viagem_id: id,
        tipo: 'DIARIA'
      },
      orderBy: {
        id: 'desc' // Ordena pela data de criação em ordem decrescente
      }
    });
  }

  findOne(id: number) {
    return this.prisma.valor_viagem.findUnique({
      where: {
        id: id
      }
    });
  }
  async update(id: number, updateValorViagemDto: UpdateValorViagemDto) {
    
    try {
      // Converter a string para número
      const valorIndividual = parseFloat(updateValorViagemDto.valor_individual.toString());
      
      // Verificar se a conversão resultou em um número válido
      if (isNaN(valorIndividual)) {
        throw new Error('Valor individual inválido: não é um número válido');
      }
      
      const result = await this.prisma.valor_viagem.update({
        where: { id },
        data: {
          valor_individual: valorIndividual // Agora usando o valor numérico
        },
      });
      return result;
    } catch (error) {
      console.error('Erro detalhado no Prisma:', error);
      throw error;
    }
  }

  updateCotacao(id: number, cotacao: string) {
    return this.prisma.valor_viagem.update({
      where: { id },
      data: {
        cotacao_dolar: parseFloat(cotacao)
      }
    });
  }

  async findOneValorDaViagem(id: number) {
    return this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: id
      }
    });
  }

  async updateValor(viagem_id: number, updateValorViagemDto: UpdateValorViagemDto) {
    return this.prisma.valor_viagem.updateMany({
      where: { viagem_id: viagem_id },
      data: updateValorViagemDto,
    })
  }

  async remove(id: number) {
    return await this.prisma.valor_viagem.delete({
      where: {
        id: id
      }
    });
  }


  async updateValorViagemTipo(viagem_id: number, tipo: string, updateValorViagemDto: UpdateValorViagemDto) {
    const pesquisa = await this.prisma.valor_viagem.findFirst({
      where: {
        viagem_id: viagem_id,
        tipo: tipo
      }
    });
  
    const dto: CreateValorViagemDto = {
      viagem_id: updateValorViagemDto.viagem_id,
      tipo: updateValorViagemDto.tipo,
      destino: updateValorViagemDto.destino,
      valor_individual: parseFloat(updateValorViagemDto.valor_individual + ""),
      valor_grupo: updateValorViagemDto.valor_grupo,
    };
  
    if (pesquisa === null) {
      try {
        await this.prisma.valor_viagem.create({
          data: dto,
        });
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          console.error('Erro específico do Prisma:', error.message);
        } else {
          console.error('Erro ao criar valor da viagem:', error.message);
        }
        throw new Error('Falha ao atualizar os valores da viagem.');
      }
    } else {
      try {
        const resultado = await this.prisma.valor_viagem.updateMany({
          where: {
            viagem_id: viagem_id,
            tipo: tipo
          },
          data: dto,
        });
        return resultado;
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
          console.error('Erro específico do Prisma:', error.message);
        } else {
          console.error('Erro ao atualizar valor da viagem:', error.message);
        }
        throw new Error('Falha ao atualizar os valores da viagem.');
      }
    }
  }

  
  async listarPorSolicitacao(
    solicitacaoId: number,
  ): Promise<ParticipanteDiariaDto[]> {
    const linhas = await this.prisma.$queryRaw<LinhaConsulta[]>`
      WITH dados AS (
        SELECT
          e.id                  AS evento_id,
          e.solicitacao_id      AS solicitacao_id,
          e.titulo              AS evento_titulo,
          ep.id                 AS evento_participantes_id,
          ep.participante_id    AS participante_id,
          p.nome                AS participante_nome,
          p.cpf                 AS participante_cpf,
          p.cargo               AS participante_cargo,
          p.lotacao             AS participante_lotacao,
          p.tipo                AS participante_tipo,
          vp.id                 AS viagem_participantes_id,
          vp.viagem_id          AS viagem_id,
          v.data_ida            AS data_ida,
          v.data_volta          AS data_volta,
          vv.id                 AS valor_viagem_id,
          vv.tipo               AS tipo_valor,
          vv.destino            AS destino,
          vv.valor_individual   AS valor_diaria,
          vv.valor_grupo        AS valor_grupo,
          vv.cotacao_dolar      AS cotacao_dolar,
          vv.participante_id    AS valor_participante_id,
          ROW_NUMBER() OVER (
            PARTITION BY ep.participante_id
            ORDER BY v.id DESC, vv.id DESC
          ) AS rn
        FROM evento e
          INNER JOIN evento_participantes ep
            ON ep.evento_id = e.id
          INNER JOIN participante p
            ON p.id = ep.participante_id
          INNER JOIN viagem_participantes vp
            ON vp.evento_participantes_id = ep.id
          INNER JOIN viagem v
            ON v.id = vp.viagem_id
          INNER JOIN valor_viagem vv
            ON vv.viagem_id = v.id
        WHERE e.solicitacao_id = ${solicitacaoId}
          AND vv.tipo = 'DIARIA'
          AND vv.valor_individual IS NOT NULL
      )
      SELECT *
      FROM dados
      WHERE rn = 1
      ORDER BY participante_nome;
    `;
  
    if (linhas.length === 0) {
      throw new NotFoundException(
        `Nenhuma diária encontrada para a solicitação ${solicitacaoId}`,
      );
    }
  
    return linhas.map((l) => ({
      participanteId: l.participante_id,
      nome: l.participante_nome,
      cpf: l.participante_cpf,
      cargo: l.participante_cargo,
      lotacao: l.participante_lotacao,
      tipo: l.participante_tipo,
      eventoId: l.evento_id,
      eventoTitulo: l.evento_titulo,
      viagemId: l.viagem_id,
      destino: l.destino,
      valorDiaria: l.valor_diaria,
      cotacaoDolar: l.cotacao_dolar,
    }));
  }
  
}

interface LinhaConsulta {
  evento_id: number;
  solicitacao_id: number;
  evento_titulo: string;
  evento_participantes_id: number;
  participante_id: number;
  participante_nome: string;
  participante_cpf: string;
  participante_cargo: string | null;
  participante_lotacao: string | null;
  participante_tipo: string;
  viagem_participantes_id: number;
  viagem_id: number;
  data_ida: Date;
  data_volta: Date | null;
  valor_viagem_id: number;
  tipo_valor: string | null;
  destino: string | null;
  valor_diaria: number | null;
  valor_grupo: number | null;
  cotacao_dolar: number | null;
  valor_participante_id: number | null;
}