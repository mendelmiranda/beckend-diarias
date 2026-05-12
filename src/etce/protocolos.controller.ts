import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ProtocoloResultado, ProtocolosService } from './protocolos.service';
import { ProtocolarPdfDto } from './protocolar-pdf.dto';


@Controller('protocolos')
export class ProtocolosController {
  constructor(private readonly service: ProtocolosService) {}

  @Post('solicitacao/:id')
  async protocolarSolicitacao( @Param('id', ParseIntPipe) id: number, @Body() dto: ProtocolarPdfDto,): Promise<ProtocoloResultado> {
    return this.service.protocolar(id, dto);
  }

  
}