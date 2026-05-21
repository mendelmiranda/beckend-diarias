// participantes-diarias.dto.ts
export class ParticipanteDiariaDto {
    participanteId: number;
    nome: string;
    cpf: string;
    cargo: string | null;
    lotacao: string | null;
    tipo: string;
    eventoId: number;
    eventoTitulo: string;
    viagemId: number | null;
    destino: string | null;
    valorDiaria: number | null;
    cotacaoDolar: number | null;
  }