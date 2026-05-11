import { Body, Controller, Post } from '@nestjs/common';
import { ProtocolosService } from './protocolos.service';
import { ProtocolarPdfDto } from './protocolar-pdf.dto';


@Controller('protocolos')
export class ProtocolosController {
  constructor(private readonly service: ProtocolosService) {}

  @Post()
  async protocolar(@Body() dto: ProtocolarPdfDto): Promise<{ codTce: string }> {
    const codTce = await this.service.protocolar(dto);
    return { codTce };
  }
}