import { PartialType } from '@nestjs/swagger';
import { CreateViagemEventoDto } from './create-viagem_evento.dto';

export class UpdateViagemEventoDto extends PartialType(CreateViagemEventoDto) {
    id: number;
    solicitacao_id?: number;
}
