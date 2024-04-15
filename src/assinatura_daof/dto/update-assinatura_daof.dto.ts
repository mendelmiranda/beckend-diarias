import { PartialType } from '@nestjs/mapped-types';
import { CreateAssinaturaDaofDto } from './create-assinatura_daof.dto';

export class UpdateAssinaturaDaofDto extends PartialType(CreateAssinaturaDaofDto) {}
