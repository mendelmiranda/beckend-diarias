import { Module } from '@nestjs/common';
import { AprovacaoDefinitivaDaofService } from './aprovacao_definitiva_daof.service';
import { AprovacaoDefinitivaDaofController } from './aprovacao_definitiva_daof.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AprovacaoDefinitivaDaofController],
  providers: [AprovacaoDefinitivaDaofService, PrismaService]
})
export class AprovacaoDefinitivaDaofModule {}
