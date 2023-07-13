import { Injectable } from '@nestjs/common';
import { CreateAnexoSolicitacaoDto } from './dto/create-anexo_solicitacao.dto';
import { UpdateAnexoSolicitacaoDto } from './dto/update-anexo_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class AnexoSolicitacaoService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  create(dto: CreateAnexoSolicitacaoDto) {
    return this.prisma.anexo_solicitacao.create({
      data: {
        api_anexo_id: dto.api_anexo_id,
        descricao: dto.descricao,
        filename: dto.filename,
        solicitacao_id: +dto.solicitacao_id,
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

  findAnexosDaSolicitacao(id: number) {
    return this.prisma.anexo_solicitacao.findMany({
      where: {
        solicitacao_id: id,
      },
      orderBy: [{ id: 'desc' }],
    });
  }

  update(id: number, updateAnexoSolicitacaoDto: UpdateAnexoSolicitacaoDto) {
    return `This action updates a #${id} anexoSolicitacao`;
  }

  async remove(id: number) {
    const anexo = await this.prisma.anexo_solicitacao.findUnique({
      where: {
        id: id,
      },
    });

    await this.prisma.anexo_solicitacao.delete({
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

  async anexosDaSolicitacao(idSolicitacao: number) {
    return await this.prisma.anexo_solicitacao.findMany({
      where: { solicitacao_id: idSolicitacao },
    });
  }

  removerUpload(idArquivo: number) {
    console.log('id arq', idArquivo);
    
    if (idArquivo > 0)
      return this.httpService.axiosRef
        .delete('http://10.10.0.73:3000/files/' + idArquivo, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '/',
            'X-API-KEY': '2VCr4x6p6iCjdO/FGTrpwtOCnrO7IZAUAH0nyTFpA38=',
          },
        })
        .then((result) => result.data)
        .catch((err) => console.log('removendo upload...'));
  }
}
