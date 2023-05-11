import { tramite } from "@prisma/client";

export class CreateLogTramiteDto {
    nome:                string;
    username:             string
    cod_lotacao_origem: number;
    lotacao_origem: string;
    cod_lotacao_destino: number;
    lotacao_destino: string;
    status: string;
    datareg: Date;
    tramite_id: number;
}
