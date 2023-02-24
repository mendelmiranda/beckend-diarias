import { PartialType } from '@nestjs/mapped-types';
import { CreateAeroportoDto } from './create-aeroporto.dto';

export class UpdateAeroportoDto extends PartialType(CreateAeroportoDto) {
  id: number;
  iata?: string;
  icao?: string;
  nome: string;
  cidade?: string;
  uf?: string;
}
