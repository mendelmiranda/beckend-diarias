import { Injectable } from '@nestjs/common';
import { CreateAnexoSolicitacaoDto } from './dto/create-anexo_solicitacao.dto';
import { UpdateAnexoSolicitacaoDto } from './dto/update-anexo_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import * as FormData from 'form-data';

@Injectable()
export class AnexoSolicitacaoService {
  constructor(private prisma: PrismaService, private readonly httpService: HttpService ) {}

  create(dto: CreateAnexoSolicitacaoDto) {
    return this.prisma.anexo_solicitacao.create({
      data: dto,
    });
  }

  findAll() {
    return `This action returns all anexoSolicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} anexoSolicitacao`;
  }

  update(id: number, updateAnexoSolicitacaoDto: UpdateAnexoSolicitacaoDto) {
    return `This action updates a #${id} anexoSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} anexoSolicitacao`;
  }

  upload(file: Express.Multer.File, idEvento: number) {
    const formData = new FormData();
    formData.append('file', file.buffer, { filename: file.originalname });
    formData.append('collection', 'anexo-evento'+idEvento);

    return this.httpService.axiosRef.post('http://10.10.0.73:3000/files/upload', formData, {
      headers:  {
        "Content-Type": "multipart/form-data",
        Accept: "/",
        "X-API-KEY": "2VCr4x6p6iCjdO/FGTrpwtOCnrO7IZAUAH0nyTFpA38=",
      }
    }).then((result) => result.data);
  }

  async anexosDaSolicitacao(idSolicitacao: number) {
    return await this.prisma.anexo_solicitacao.findMany({ 
      where: {solicitacao_id: idSolicitacao}
    })
  }

  removerUpload(idArquivo: number) {
    if (idArquivo > 0)
      return this.httpService.axiosRef
        .delete("http://10.10.0.73:3000/files/" + idArquivo, {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "/",
            "X-API-KEY": "2VCr4x6p6iCjdO/FGTrpwtOCnrO7IZAUAH0nyTFpA38=",
          },
        })
        .then((result) => result.data).catch(err => console.log('removendo upload...'));
  }
}
