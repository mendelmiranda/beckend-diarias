import { PartialType } from '@nestjs/mapped-types';
import { CreateAprovacaoDefinitivaDaofDto } from './create-aprovacao_definitiva_daof.dto';

export class UpdateAprovacaoDefinitivaDaofDto extends PartialType(CreateAprovacaoDefinitivaDaofDto) {}
