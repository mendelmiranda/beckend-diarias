import { Module } from '@nestjs/common';
import { ETceModule } from '../etce/etce.module';
import { ProtocolosController } from './protocolos.controller';
import { ProtocolosService } from './protocolos.service';

@Module({
  imports: [ETceModule],
  controllers: [ProtocolosController],
  providers: [ProtocolosService],
})
export class ProtocolosModule {}