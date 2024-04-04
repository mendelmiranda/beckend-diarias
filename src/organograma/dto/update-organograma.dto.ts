import { PartialType } from '@nestjs/mapped-types';
import { CreateOrganogramaDto } from './create-organograma.dto';

export class UpdateOrganogramaDto extends PartialType(CreateOrganogramaDto) {}
