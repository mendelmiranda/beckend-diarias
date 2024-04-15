import { PartialType } from '@nestjs/mapped-types';
import { CreateAssinaturaDaradDto } from './create-assinatura_darad.dto';

export class UpdateAssinaturaDaradDto extends PartialType(CreateAssinaturaDaradDto) {}
