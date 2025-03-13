import { PartialType } from '@nestjs/mapped-types';
import { CreateValorDiariaDto } from './create-valor_diaria.dto';

export class UpdateValorDiariaDto extends PartialType(CreateValorDiariaDto) {
    
  dentro?: number;

  fora?: number;

  internacional?: number;

  datareg?: Date;

  cargo_diarias?: CreateValorDiariaDto[];
}
