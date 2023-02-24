import { PartialType } from '@nestjs/mapped-types';
import { CreateAeroportoDto } from './create-aeroporto.dto';

export class UpdateAeroportoDto extends PartialType(CreateAeroportoDto) {}
