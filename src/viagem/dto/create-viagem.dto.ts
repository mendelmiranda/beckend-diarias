export class CreateViagemDto {
    origem_id: number;
    destino_id: number;
    trecho: string;
    data_ida: Date;
    data_volta?: Date;
    datareg: Date;
    justificativa?: string;
}
