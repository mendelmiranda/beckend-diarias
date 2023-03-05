import { Injectable } from '@nestjs/common';
import { CreateTramiteSolicitacaoDto } from './dto/create-tramite_solicitacao.dto';
import { UpdateTramiteSolicitacaoDto } from './dto/update-tramite_solicitacao.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class TramiteSolicitacaoService {
  constructor(private prisma: PrismaService) {}

  create(createTramiteSolicitacaoDto: CreateTramiteSolicitacaoDto) {
    return 'This action adds a new tramiteSolicitacao';
  }

  findAll() {
    return `This action returns all tramiteSolicitacao`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tramiteSolicitacao`;
  }

  update(id: number, updateTramiteSolicitacaoDto: UpdateTramiteSolicitacaoDto) {
    return `This action updates a #${id} tramiteSolicitacao`;
  }

  remove(id: number) {
    return `This action removes a #${id} tramiteSolicitacao`;
  }
}
