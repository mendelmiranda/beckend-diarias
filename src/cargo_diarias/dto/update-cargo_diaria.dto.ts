import { PartialType } from '@nestjs/mapped-types';
import { CreateCargoDiariaDto } from './create-cargo_diaria.dto';

export class UpdateCargoDiariaDto extends PartialType(CreateCargoDiariaDto) {}
