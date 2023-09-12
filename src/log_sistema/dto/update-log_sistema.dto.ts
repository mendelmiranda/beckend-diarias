import { PartialType } from '@nestjs/mapped-types';
import { CreateLogSistemaDto } from './create-log_sistema.dto';

export class UpdateLogSistemaDto extends PartialType(CreateLogSistemaDto) {}
