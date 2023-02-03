import { PartialType } from '@nestjs/mapped-types';
import { CreateViagemDto } from './create-viagem.dto';

export class UpdateViagemDto extends PartialType(CreateViagemDto) {}
