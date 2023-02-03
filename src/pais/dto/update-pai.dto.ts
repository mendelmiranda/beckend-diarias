import { PartialType } from '@nestjs/mapped-types';
import { CreatePaiDto } from './create-pai.dto';

export class UpdatePaiDto extends PartialType(CreatePaiDto) {
    id: number;
    nome: string;
    nome_pt: string;
    sigla: string;
    bacen: string;
}
