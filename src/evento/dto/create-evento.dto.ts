export class CreateEventoDto {
    tipo_evento_id: number;
    solicitacao_id: number;
    titulo: string;
    inicio: Date;
    fim: Date;
    exterior: string;
    local_exterior?: string;
    cidade_id: number;
    pais_id: number;
    informacoes: string;
    datareg: Date;
    tem_passagem?: string;
    valor_total_inscricao?: number;
    valor_evento?: number;
    observacao_valor?: string;
}
 