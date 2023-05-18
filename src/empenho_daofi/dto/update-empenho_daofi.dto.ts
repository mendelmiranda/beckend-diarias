import { PartialType } from '@nestjs/mapped-types';
import { CreateEmpenhoDaofiDto } from './create-empenho_daofi.dto';

export class UpdateEmpenhoDaofiDto extends PartialType(CreateEmpenhoDaofiDto) {}
