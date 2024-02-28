import { PartialType } from '@nestjs/mapped-types';
import { CreateCondutoreDto } from './create-condutore.dto';

export class UpdateCondutoreDto extends PartialType(CreateCondutoreDto) {}
