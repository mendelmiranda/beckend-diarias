import { Module } from '@nestjs/common';
import { AprovacaoDefinitivaService } from './aprovacao_definitiva.service';
import { AprovacaoDefinitivaController } from './aprovacao_definitiva.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AprovacaoDefinitivaController],
  providers: [AprovacaoDefinitivaService, PrismaService]
})
export class AprovacaoDefinitivaModule {}
