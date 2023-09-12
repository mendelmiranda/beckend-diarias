import { PartialType } from '@nestjs/mapped-types';
import { CreateAnexoSolicitacaoDto } from './create-anexo_solicitacao.dto';

export class UpdateAnexoSolicitacaoDto extends PartialType(CreateAnexoSolicitacaoDto) {}
