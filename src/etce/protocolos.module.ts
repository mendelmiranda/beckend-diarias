import { Module } from '@nestjs/common';
import { ETceModule } from '../etce/etce.module';
import { ProtocolosController } from './protocolos.controller';
import { ProtocolosService } from './protocolos.service';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [ETceModule, PrismaModule],
  controllers: [ProtocolosController],
  providers: [ProtocolosService],
})
export class ProtocolosModule {}