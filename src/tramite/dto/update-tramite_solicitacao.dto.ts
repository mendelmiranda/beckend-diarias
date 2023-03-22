import { PartialType } from '@nestjs/mapped-types';
import { CreateTramiteSolicitacaoDto } from './create-tramite_solicitacao.dto';

export class UpdateTramiteSolicitacaoDto extends PartialType(CreateTramiteSolicitacaoDto) {}
