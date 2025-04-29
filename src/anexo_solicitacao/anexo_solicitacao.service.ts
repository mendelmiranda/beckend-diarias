import { Injectable } from '@nestjs/common';
import { CreateAnexoSolicitacaoDto } from './dto/create-anexo_solicitacao.dto';
import { UpdateAnexoSolicitacaoDto } from './dto/update-anexo_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';
import * as https from 'https';


@Injectable()
export class AnexoSolicitacaoService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) { }

  create(dto: CreateAnexoSolicitacaoDto) {
    return this.prisma.anexo_evento.create({
      data: {
        api_anexo_id: dto.api_anexo_id,
        descricao: dto.descricao,
        filename: dto.filename,
        evento_id: +dto.evento_id,
        categoria: dto.categoria,
      },
    });
  }

  findAll() {
    return `This action returns all anexoSolicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} anexoSolicitacao`;
  }

  findAnexosDoEvento(id: number) {
    return this.prisma.anexo_evento.findMany({
      where: {
        evento_id: id,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  update(id: number, updateAnexoSolicitacaoDto: UpdateAnexoSolicitacaoDto) {
    return `This action updates a #${id} anexoSolicitacao`;
  }

  async remove(id: number) {
    const anexo = await this.prisma.anexo_evento.findUnique({
      where: {
        id: id,
      },
    });

    await this.prisma.anexo_evento.delete({
      where: {
        id: id,
      },
    });

    let idAquivo = 0;
    if (anexo !== null) idAquivo = anexo.api_anexo_id;
    return this.removerUpload(idAquivo);
  }

  upload(file: Express.Multer.File, solicitacaoId: number) {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });
    formData.append('collection', 'anexo-evento' + solicitacaoId);

    return this.httpService.axiosRef
      .post('https://arquivos.tce.ap.gov.br:3000/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '/',
          'X-API-KEY': '2VCr4x6p6iCjdO/FGTrpwtOCnrO7IZAUAH0nyTFpA38=',
        },
      })
      .then((result) => result.data);
  }

  async anexosDoEvento(idEvento: number) {
    return await this.prisma.anexo_evento.findMany({
      where: { evento_id: idEvento },
    });
  }

  removerUpload(idArquivo: number) {

    if (idArquivo > 0)
      return this.httpService.axiosRef
        .delete('https://arquivos.tce.ap.gov.br:3000/files/' + idArquivo, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '/',
            'X-API-KEY': '2VCr4x6p6iCjdO/FGTrpwtOCnrO7IZAUAH0nyTFpA38=',
          },
        })
        .then((result) => result.data)
        .catch((err) => console.log('removendo upload...'));
  }

  async pesquisarServidoresAtivos() {
    const url = 'https://10.10.21.19:5001/devops-servidor/search?ativo=SIM';
    const headers = {
      Accept: '/',
      'X-API-KEY': 'FZTETvO9rlP15e9E9dDlPWUhDxV24GsrdH1e5e38ZX4dpzc6MW64sZmZUBkxCLhc',
    };

    // Cria um agente HTTPS que ignora a verificação de SSL
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      const response = await this.httpService.axiosRef.get(url, { headers, httpsAgent });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar servidores ativos:', error);
      throw error;
    }
  }

  async pesquisarServidoresAtivosPeloCpf(cpf: string) {
    const url = 'https://10.10.21.19:5001/devops-servidor/search?ativo=SIM&cpf=' + cpf;
    const headers = {
      Accept: '/',
      'X-API-KEY': 'FZTETvO9rlP15e9E9dDlPWUhDxV24GsrdH1e5e38ZX4dpzc6MW64sZmZUBkxCLhc',
    };

    // Cria um agente HTTPS que ignora a verificação de SSL
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      const response = await this.httpService.axiosRef.get(url, { headers, httpsAgent });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar servidores ativos:', error);
      throw error;
    }
  }

  async pesquisarServidoresAtivosPeloNome(nome: string) {
    const url = 'https://10.10.21.19:5001/devops-servidor/search?ativo=SIM&nome=' + nome;
    const headers = {
      Accept: '/',
      'X-API-KEY': 'FZTETvO9rlP15e9E9dDlPWUhDxV24GsrdH1e5e38ZX4dpzc6MW64sZmZUBkxCLhc',
    };

    // Cria um agente HTTPS que ignora a verificação de SSL
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      const response = await this.httpService.axiosRef.get(url, { headers, httpsAgent });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar servidores ativos:', error);
      throw error;
    }
  }

  async listarSetores() {
    const url = 'https://10.10.21.19:5001/devops-servidor/search?ativo=SIM&campos=cod_lotacao,lotacao';
    const headers = {
      Accept: '/',
      'X-API-KEY': 'FZTETvO9rlP15e9E9dDlPWUhDxV24GsrdH1e5e38ZX4dpzc6MW64sZmZUBkxCLhc',
    };

    // Cria um agente HTTPS que ignora a verificação de SSL
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      const response = await this.httpService.axiosRef.get(url, { headers, httpsAgent });
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar servidores ativos:', error);
      throw error;
    }
  }



}
