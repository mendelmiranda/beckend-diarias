import { PartialType } from '@nestjs/mapped-types';
import { CreateEncaminharSolicitacaoDto } from './create-encaminhar_solicitacao.dto';

export class UpdateEncaminharSolicitacaoDto extends PartialType(CreateEncaminharSolicitacaoDto) {}
