import { PrismaService } from '../../prisma/prisma.service';
import { Module } from '@nestjs/common';
import { TramiteController } from './tramite.controller';
import { TramiteService } from './tramite.service';


@Module({
  controllers: [TramiteController],
  providers: [TramiteService, PrismaService],
})
export class TramiteModule {}
