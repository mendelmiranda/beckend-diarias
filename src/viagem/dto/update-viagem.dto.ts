import { PartialType } from '@nestjs/mapped-types';
import { CreateViagemDto } from './create-viagem.dto';

export class UpdateViagemDto extends PartialType(CreateViagemDto) {
    id: number; 
    origem_id: number;
    destino_id: number;
    trecho: string;
    data_ida: Date;
    data_volta?: Date;
    datareg: Date;
    justificativa?: string;
}
