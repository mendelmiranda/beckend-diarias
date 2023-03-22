import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteSolicitacaoService } from './tramite.service';
import { TramiteSolicitacaoController } from './tramite.controller';

@Module({
  controllers: [TramiteSolicitacaoController],
  providers: [TramiteSolicitacaoService, PrismaService],
})
export class TramiteModule {}
