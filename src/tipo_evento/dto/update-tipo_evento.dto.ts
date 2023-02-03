import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoEventoDto } from './create-tipo_evento.dto';

export class UpdateTipoEventoDto extends PartialType(CreateTipoEventoDto) {
    id: number;
    decricao: string;
}
