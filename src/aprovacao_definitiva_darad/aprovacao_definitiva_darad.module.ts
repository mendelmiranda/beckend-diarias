import { Module } from '@nestjs/common';
import { AprovacaoDefinitivaDaradService } from './aprovacao_definitiva_darad.service';
import { AprovacaoDefinitivaDaradController } from './aprovacao_definitiva_darad.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AprovacaoDefinitivaDaradController],
  providers: [AprovacaoDefinitivaDaradService, PrismaService]
})
export class AprovacaoDefinitivaDaradModule {}
