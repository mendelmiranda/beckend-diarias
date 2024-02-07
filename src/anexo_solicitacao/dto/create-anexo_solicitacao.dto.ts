import { solicitacao } from "@prisma/client";

export class CreateAnexoSolicitacaoDto {
    categoria?: string;
    descricao?: string;
    datareg?:   Date;
    api_anexo_id: number;
    filename: string;
    evento_id: number;
}
