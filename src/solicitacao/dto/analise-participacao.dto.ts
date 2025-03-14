import { EventoParticipanteDto } from "./evento-participante.dto";

export class AnaliseParticipacaoDto {
    participante_nome: string;
    participante_cpf: string;
    eventos: EventoParticipanteDto[];
    data_primeiro_evento: Date;
    data_ultimo_evento: Date;
    total_dias: number;
    total_eventos: number;
  }