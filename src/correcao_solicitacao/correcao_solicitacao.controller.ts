import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CorrecaoSolicitacaoService } from './correcao_solicitacao.service';
import { CreateCorrecaoSolicitacaoDto } from './dto/create-correcao_solicitacao.dto';
import { UpdateCorrecaoSolicitacaoDto } from './dto/update-correcao_solicitacao.dto';

@Controller('correcao-solicitacao')
export class CorrecaoSolicitacaoController {
  constructor(private readonly correcaoSolicitacaoService: CorrecaoSolicitacaoService) {}

  @Post()
  create(@Body() createCorrecaoSolicitacaoDto: CreateCorrecaoSolicitacaoDto) {
    return this.correcaoSolicitacaoService.create(createCorrecaoSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.correcaoSolicitacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.correcaoSolicitacaoService.findOne(+id);
  }

  @Get('/solicitacao/:id')
  corrigirSolicitacao(@Param('id') id: string) {
    return this.correcaoSolicitacaoService.carregarSolicitacaoParaCorrecao(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCorrecaoSolicitacaoDto: UpdateCorrecaoSolicitacaoDto) {
    return this.correcaoSolicitacaoService.update(+id, updateCorrecaoSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.correcaoSolicitacaoService.remove(+id);
  }
}
