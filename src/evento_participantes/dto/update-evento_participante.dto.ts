import { PartialType } from '@nestjs/mapped-types';
import { CreateEventoParticipanteDto } from './create-evento_participante.dto';

export class UpdateEventoParticipanteDto extends PartialType(CreateEventoParticipanteDto) {}
