import { Module } from '@nestjs/common';
import { ETceModule } from '../etce/etce.module';
import { ProtocolosController } from './protocolos.controller';
import { ProtocolosService } from './protocolos.service';
import { PrismaModule } from 'prisma/prisma.module';
import { PdfModule } from 'src/pdf/pdf.module';
import { CiMemoriaPdfBuilder } from './ci-memoria-pdf.builder';

@Module({
  imports: [ETceModule, PrismaModule, PdfModule],
  controllers: [ProtocolosController],
  providers: [ProtocolosService, CiMemoriaPdfBuilder],
})
export class ProtocolosModule {}