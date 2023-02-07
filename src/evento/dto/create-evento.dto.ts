export class CreateEventoDto {

    tipo_evento_id: number;
    solicitacao_id: number;
    titulo: string;
    inicio: Date;
    fim: Date;
    exterior?: string;
    local_exterior?: string;
    cidade_id: number;
    pais_id: number;
    informacoes: string;
    
}
