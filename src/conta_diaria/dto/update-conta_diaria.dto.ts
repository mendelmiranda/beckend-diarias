import { PartialType } from '@nestjs/mapped-types';
import { CreateContaDiariaDto } from './create-conta_diaria.dto';

export class UpdateContaDiariaDto extends PartialType(CreateContaDiariaDto) {
    id: number;
    nome: string;
    cpf: string;
    tipo: string;
    tipo_conta: string;
    agencia: string;
    conta: string;
    banco_id: number;
    participante_id: number;
}
