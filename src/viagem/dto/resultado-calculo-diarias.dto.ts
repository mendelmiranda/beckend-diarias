export class FalhaDiariaDto {
  participanteId: number;
  nome: string;
  motivo: string;
}

export class ResultadoCalculoDiariasDto {
  total: number;
  elegiveis: number;
  calculou: boolean;
  falhas: FalhaDiariaDto[];
}
