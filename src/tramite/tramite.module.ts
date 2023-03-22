import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteController } from './tramite.controller';
import { TramiteService } from './tramite.service';
import { TramiteSolicitacaoService } from 'src/tramite_solicitacao/tramite_solicitacao.service';

@Module({
  controllers: [TramiteController],
  providers: [TramiteService, PrismaService, TramiteSolicitacaoService],
})
export class TramiteModule {}
