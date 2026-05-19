import { Type } from 'class-transformer';
import {
  IsBase64,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class InteressadoDto {
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos numéricos' })
  cpf: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  nome: string;
}

export class ProtocolarPdfDto {
  /** Opcional: o servidor passa a gerar o PDF com dados completos (ex.: contas bancárias). */
  @IsOptional()
  @IsBase64()
  pdfBase64?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nomeArquivo: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(8000)
  assunto: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  numOficio: string;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  observacoes?: string;

  @IsOptional()
  @IsBoolean()
  prioritario?: boolean;

  @ValidateNested()
  @Type(() => InteressadoDto)
  interessado: InteressadoDto;
}