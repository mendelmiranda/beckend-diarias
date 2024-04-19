import { PartialType } from '@nestjs/mapped-types';
import { CreateDiariaCondutorDto } from './create-diaria_condutor.dto';

export class UpdateDiariaCondutorDto extends PartialType(CreateDiariaCondutorDto) {}
