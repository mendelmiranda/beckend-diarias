import { PartialType } from '@nestjs/mapped-types';
import { CreateAprovacaoDefinitivaDaradDto } from './create-aprovacao_definitiva_darad.dto';

export class UpdateAprovacaoDefinitivaDaradDto extends PartialType(CreateAprovacaoDefinitivaDaradDto) {}
