import { PartialType } from '@nestjs/mapped-types';
import { CreateAprovacaoDefinitivaDto } from './create-aprovacao_definitiva.dto';

export class UpdateAprovacaoDefinitivaDto extends PartialType(CreateAprovacaoDefinitivaDto) {}
