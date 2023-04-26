import { PartialType } from '@nestjs/mapped-types';
import { CreateCorrecaoSolicitacaoDto } from './create-correcao_solicitacao.dto';

export class UpdateCorrecaoSolicitacaoDto extends PartialType(CreateCorrecaoSolicitacaoDto) {}
