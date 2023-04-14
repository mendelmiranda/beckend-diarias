import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoDto } from './create-evento.dto';

export class UpdateEventoDto extends PartialType(CreateEventoDto) {
    id: number;
    tipo_evento_id: number;
    solicitacao_id: number;
    titulo: string;
    inicio: Date;
    fim: Date;
    pais_id: number;
    exterior?: string;
    local_exterior?: string;
    cidade_id: number;
    informacoes: string;
    tem_passagem?: string;
    valor_total_inscricao?: number;
    valor_evento?: number;
}
