export class CreateViagemDto {
    /* origem_id: number;
    destino_id: number;
    trecho: string;
    data_ida: Date;
    data_volta?: Date;
    datareg: Date;
    justificativa?: string; */

    origem_id: number;  
    destino_id: number; 
    exterior: string;
    local_exterior: string;
    pais_id: number;
      
    trecho: string;
    data_ida:            Date;
    data_volta?:           Date
    justificativa?:       string;
    datareg?:              Date;             
    arcar_passagem?: string;
    custos: string[]
}
