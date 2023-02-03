import { PartialType } from '@nestjs/mapped-types';
import { CreateContaDiariaDto } from './create-conta_diaria.dto';

export class UpdateContaDiariaDto extends PartialType(CreateContaDiariaDto) {
    id: number;
    nome: string;
    cpf: string;
    tipo: string;
    agencia: string;
    conta: string;
}
