import { PartialType } from '@nestjs/mapped-types';
import { CreateSolicitacaoCondutoreDto } from './create-solicitacao_condutore.dto';

export class UpdateSolicitacaoCondutoreDto extends PartialType(CreateSolicitacaoCondutoreDto) {}
