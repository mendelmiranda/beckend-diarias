import { CacheModule, Module } from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { CidadeController } from './cidade.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [CidadeController],
  providers: [CidadeService, PrismaService],
  imports: [CacheModule.register()]
})
export class CidadeModule {}
