import { PartialType } from '@nestjs/mapped-types';
import { CreateValorViagemDto } from './create-valor_viagem.dto';

export class UpdateValorViagemDto extends PartialType(CreateValorViagemDto) {}
