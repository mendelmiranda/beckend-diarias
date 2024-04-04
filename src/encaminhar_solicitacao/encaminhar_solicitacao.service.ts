import { Injectable } from '@nestjs/common';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class EncaminharSolicitacaoService {

  constructor(private prisma: PrismaService) {}

  create(createEncaminharSolicitacaoDto: CreateEncaminharSolicitacaoDto) {
    return 'This action adds a new encaminharSolicitacao';
  }

  findAll() {
    return `This action returns all encaminharSolicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} encaminharSolicitacao`;
  }

  update(id: number, updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    return `This action updates a #${id} encaminharSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} encaminharSolicitacao`;
  }
}
