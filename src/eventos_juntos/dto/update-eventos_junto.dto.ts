import { PartialType } from '@nestjs/mapped-types';
import { CreateEventosJuntoDto } from './create-eventos_junto.dto';

export class UpdateEventosJuntoDto extends PartialType(CreateEventosJuntoDto) {}
