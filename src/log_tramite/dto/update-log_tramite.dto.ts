import { PartialType } from '@nestjs/mapped-types';
import { CreateLogTramiteDto } from './create-log_tramite.dto';

export class UpdateLogTramiteDto extends PartialType(CreateLogTramiteDto) {}
