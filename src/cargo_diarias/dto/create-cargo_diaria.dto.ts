import { valor_diarias } from "@prisma/client";

export class CreateCargoDiariaDto {

    cargo: string;
    classe: string;
    valor_diarias_id: number; 
}
