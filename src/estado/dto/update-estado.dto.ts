import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoDto } from './create-estado.dto';

export class UpdateEstadoDto extends PartialType(CreateEstadoDto) {
    id: number;
    descricao: string;
    uf: string;
}
