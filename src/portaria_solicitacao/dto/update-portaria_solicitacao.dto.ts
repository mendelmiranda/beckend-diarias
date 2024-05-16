import { PartialType } from '@nestjs/swagger';
import { CreatePortariaSolicitacaoDto } from './create-portaria_solicitacao.dto';

export class UpdatePortariaSolicitacaoDto extends PartialType(CreatePortariaSolicitacaoDto) {}
