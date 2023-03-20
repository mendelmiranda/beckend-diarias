import { valor_diarias } from "@prisma/client";

export class CreateCargoDiariaDto {

    cargo: string;
    funcao?: string;
    valor_diarias_id: number; 
}
