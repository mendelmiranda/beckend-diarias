import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateAeroportoDto } from './dto/create-aeroporto.dto';
import { UpdateAeroportoDto } from './dto/update-aeroporto.dto';

@Injectable()
export class AeroportoService {
  constructor(private prisma: PrismaService) { }

  create(createAeroportoDto: CreateAeroportoDto) {
    return 'This action adds a new aeroporto';
  }

  findAll() {
    return this.prisma.$queryRaw(
      Prisma.sql`SELECT a.id, uf || ' ' ||cidade as cidade FROM aeroporto a ORDER BY a.cidade, a.uf`,
      //Prisma.sql`SELECT c.id, e.uf || ' ' ||c.descricao as cidade from estado e, cidade c where e.id = c.estado_id`
    );
  }

  async getAeroportos(query: string) {
    const resultados = await this.prisma.$queryRaw`
  SELECT * FROM aeroporto
  WHERE cidade % ${query}
  ORDER BY similarity(cidade, ${query}) DESC
`;

    return resultados;
  }

  async searchAeroportoEPais(query: string) {
    try {
      const resultados = await this.prisma.$queryRaw`
    WITH combined_results AS (
      SELECT 
        'cidade' as tipo,
        id,
        cidade,
        uf,
        estado,
        NULL as nome_pt,
        NULL as sigla,
        NULL as bacen,
        similarity(cidade, ${query}) as sim_score
      FROM aeroporto
      WHERE cidade % ${query}
      
      UNION ALL
      
      SELECT 
        'pais' as tipo,
        id,
        NULL as cidade,
        NULL as uf,
        NULL as estado,
        nome_pt,
        sigla,
        bacen,
        similarity(nome_pt, ${query}) as sim_score
      FROM pais
      WHERE nome_pt % ${query}
    )
    SELECT *
    FROM combined_results
    ORDER BY sim_score DESC
  `;

  return resultados;

    } catch (error) {
      console.error('Erro ao buscar aeroportos:', error);
      throw error;
    }
  }

  /* async getAeroportos(query: string): Promise<{ id: number; cidade: string }[]> {
    try {
      const result = await this.prisma.aeroporto.findMany({
        where: {
          OR: [
            {
              cidade: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              uf: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          id: true,
          cidade: true,
          uf: true,
        },
      });

      const formattedResult = result.map((aeroporto) => ({
        id: aeroporto.id,
        cidade: `${aeroporto.uf} ${aeroporto.cidade}`,
      }));

      return formattedResult;
    } catch (error) {
      console.error('Erro ao buscar aeroportos:', error);
      throw error;
    }
  } */

  async findCidadePais(descricao: string) {
    const resultado = this.prisma.$queryRaw(
      Prisma.sql`SELECT descricao as descricao FROM cidade WHERE UPPER(descricao) LIKE '%${descricao}%'
                        UNION
                        SELECT nome_pt as descricao FROM pais WHERE UPPER(nome_pt) LIKE '%${descricao}%'`,
    );

    return await resultado;
  }

  findOne(id: number) {
    return this.prisma.aeroporto.findFirst({
      where: {
        id: +id,
      },
    });
  }

  update(id: number, updateAeroportoDto: UpdateAeroportoDto) {
    return `This action updates a #${id} aeroporto`;
  }

  remove(id: number) {
    return `This action removes a #${id} aeroporto`;
  }
}
