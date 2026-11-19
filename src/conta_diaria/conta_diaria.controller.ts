import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { InfoUsuario } from 'src/log_sistema/log_sistema.service';
import { ContaDiariaService } from './conta_diaria.service';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

function usuarioDaRequisicao(request: Request): InfoUsuario {
  const dadosClient = request.headers['dados_client'];
  if (!dadosClient) {
    throw new BadRequestException('Header dados_client não encontrado');
  }

  const dadosClientStr = Array.isArray(dadosClient) ? dadosClient[0] : dadosClient;

  let usuario: InfoUsuario;
  try {
    usuario = JSON.parse(dadosClientStr) as InfoUsuario;
  } catch {
    throw new BadRequestException('Header dados_client inválido');
  }

  if (!usuario?.nomeCompleto?.trim() && !usuario?.username?.trim()) {
    throw new BadRequestException('Header dados_client sem identificação do usuário');
  }

  return usuario;
}

@Controller('conta-diaria')
export class ContaDiariaController {
  constructor(private readonly contaDiariaService: ContaDiariaService) {}

  @Post()
  create(@Body() createContaDiariaDto: CreateContaDiariaDto, @Req() request: Request) {
    return this.contaDiariaService.create(createContaDiariaDto, usuarioDaRequisicao(request));
  }

  @Get()
  findAll() {
    return this.contaDiariaService.findAll();
  }

  @Get('/participante/cpf/:cpf')
  pesquisaContaDoParticipantePorCpf(@Param('cpf') cpf: string) {
    return this.contaDiariaService.pesquisaContaDoParticipantePorCpf(cpf);
  }

  @Get('/geral/participante/cpf/:cpf')
  pesquisaContaDoParticipanteGeralPorCpf(@Param('cpf') cpf: string) {
    return this.contaDiariaService.pesquisaContaDoParticipanteGeralPorCpf(cpf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contaDiariaService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContaDiariaDto: UpdateContaDiariaDto,
    @Req() request: Request,
  ) {
    return this.contaDiariaService.update(
      +id,
      updateContaDiariaDto,
      usuarioDaRequisicao(request),
    );

    /* if (updateContaDiariaDto.id > 0 || updateContaDiariaDto.id === undefined) {
      const data: CreateContaDiariaDto = {
        nome: updateContaDiariaDto.nome,
        cpf: updateContaDiariaDto.cpf,
        tipo: updateContaDiariaDto.tipo,
        tipo_conta: updateContaDiariaDto.tipo_conta,
        agencia: updateContaDiariaDto.agencia,
        conta: updateContaDiariaDto.conta,
        banco_id: updateContaDiariaDto.banco_id,
      };
      return this.contaDiariaService.create(data);
    } else {
      return this.contaDiariaService.update(+id, updateContaDiariaDto);
    } */
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contaDiariaService.remove(+id);
  }
}
