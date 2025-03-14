export class EventoParticipanteDto {
    evento_id: number;
    titulo: string;
    inicio: Date;
    fim: Date;
    tem_passagem: string;
    exterior: string;
    tipo_evento: string;
    pais: string;
    cidade: string | null;
    valor_evento: number | null;
    participante_id: number;
    participante_nome: string;
    participante_cpf: string;
    data_nascimento: Date;
    participante_matricula: number | null;
    participante_cargo: string | null;
    participante_email: string | null;
    participante_telefone: string | null;
  }