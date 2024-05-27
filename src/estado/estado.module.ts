import { CacheModule, Module } from '@nestjs/common';
import { EstadoService } from './estado.service';
import { EstadoController } from './estado.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [EstadoController],
  providers: [EstadoService, PrismaService],
  imports: [CacheModule.register()]

})
export class EstadoModule {}
