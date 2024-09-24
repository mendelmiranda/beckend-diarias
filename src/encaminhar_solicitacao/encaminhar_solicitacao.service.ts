import { Injectable } from '@nestjs/common';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EncaminharSolicitacaoService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateEncaminharSolicitacaoDto) {
    return this.prisma.encaminhar_solicitacao.create({
      data: {
        ...dto,
        datareg: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.encaminhar_solicitacao.findMany({
      include: {
        solicitacao: true,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  findOne(id: number) {
    return this.prisma.encaminhar_solicitacao.findUnique({
      where: { id: id },
    });
  }

  async findAvisoDoTramite(codLotacao: number) {
    let resultado;
    try {
      if (Number.isNaN(codLotacao)) {
        //throw new Error("Código de lotação destino é inválido.");
      }
      resultado = await this.prisma.encaminhar_solicitacao.findMany({
        where: {
          AND: {
            cod_lotacao_destino: +codLotacao,
            lido: 'NAO'
          }
        }
      });
    } catch (error) {
      // console.error("Erro ao buscar avisos do trâmite:", error);
      //throw error;  // Ou manipule o erro como preferir
    }
  }


  update(id: number, updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    return this.prisma.encaminhar_solicitacao.update({
      where: { id },
      data: updateEncaminharSolicitacaoDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} encaminharSolicitacao`;
  }

  async removerTramitesGeral(solicitacaoId: number) {
    try {
      const result = await this.prisma.$executeRaw`SELECT public.limpar_tramite_por_solicitacao(${solicitacaoId}::INTEGER)`;
      return result;
    } catch (error) {
      console.error("Erro ao remover trâmites da solicitação:", error);      
    }
  }


}
