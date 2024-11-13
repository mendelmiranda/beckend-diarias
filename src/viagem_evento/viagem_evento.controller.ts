import { Controller } from '@nestjs/common';
import { ViagemEventoService } from './viagem_evento.service';

@Controller('viagem-evento')
export class ViagemEventoController {
  constructor(private readonly viagemEventoService: ViagemEventoService) {}
}
