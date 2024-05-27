import { CacheModule, Module } from '@nestjs/common';
import { AeroportoService } from './aeroporto.service';
import { AeroportoController } from './aeroporto.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [AeroportoController],
  providers: [AeroportoService, PrismaService],
  imports: [CacheModule.register()]
})
export class AeroportoModule {}
