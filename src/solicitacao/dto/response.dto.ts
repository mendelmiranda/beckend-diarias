import { AnaliseParticipacaoDto } from "./analise-participacao.dto";
import { ValorDiariasDto } from "./valor-diarias.dto";

export class DiariasResponseDto {
    analise: AnaliseParticipacaoDto;
    valores_diarias: ValorDiariasDto | null;
    valor_diaria: number;
  }