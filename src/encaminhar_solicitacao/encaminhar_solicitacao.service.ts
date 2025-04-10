import { Injectable } from '@nestjs/common';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';
import { encaminhar_solicitacao } from '@prisma/client';

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


  async verificarSolicitacoesPorSetor(setorId: number): Promise<encaminhar_solicitacao[]> {
    try {
      const solicitacoes = await this.prisma.encaminhar_solicitacao.findMany({
        where: {
          cod_lotacao_destino: setorId,
          // Outras condições que você possa ter
        },
        include: {
          solicitacao: true, // Se você precisa incluir relações
        },
      });
      
      // Sempre retorne um array, mesmo que vazio
      return solicitacoes || [];
    } catch (error) {
      console.log(`Erro ao buscar solicitações para o setor ${setorId}`, error.stack);
      // Ainda retorne um array vazio em caso de erro, ou rethrow se preferir
      return [];
      // Ou relance o erro para ser tratado pelo tratador global
      // throw new InternalServerErrorException('Erro ao buscar solicitações');
    }
  }
  

  /* async findAvisoDoTramite(codLotacao: number) {
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
  } */


  update(id: number, updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    try{
      return this.prisma.encaminhar_solicitacao.update({
        where: { id },
        data: updateEncaminharSolicitacaoDto,
      });
    }catch(e){
      console.error("Erro ao atualizar o trâmite:", e);
    }
  }
  atualizarLidoTodasDoSetor(setorId: number) {
    try {
      return this.prisma.encaminhar_solicitacao.updateMany({
        where: { 
          cod_lotacao_destino: setorId,
          lido: { not: 'S' }
        },
        data: {
          lido: 'S',
        },
      });
    } catch (e) {
      console.error("Erro ao atualizar os trâmites:", e);
      throw e;
    }
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
