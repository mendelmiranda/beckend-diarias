import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe, HttpException, HttpStatus } from '@nestjs/common';
import { EncaminharSolicitacaoService } from './encaminhar_solicitacao.service';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';

@Controller('encaminhar-solicitacao')
export class EncaminharSolicitacaoController {
  constructor(private readonly encaminharSolicitacaoService: EncaminharSolicitacaoService) { }

  @Post()
  create(@Body() createEncaminharSolicitacaoDto: CreateEncaminharSolicitacaoDto) {
    return this.encaminharSolicitacaoService.create(createEncaminharSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.encaminharSolicitacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.encaminharSolicitacaoService.findOne(+id);
  }

  @Get('verifica/setor/:id')
  async verificarSolicitacoesPorSetor(@Param('id', ParseIntPipe) id: number) {
    try {
      const solicitacoes = await this.encaminharSolicitacaoService.verificarSolicitacoesPorSetor(id);
      // Sempre retorne um objeto JSON válido, mesmo que seja um array vazio
      return solicitacoes;
    } catch (error) {
      // Trate exceções específicas ou use um filtro de exceção global
      throw new HttpException('Erro ao buscar solicitações', HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /* @Get('/verifica/setor/:id')
  findAvisoTramitePorSetor(@Param('id') id: number) {    
    return this.encaminharSolicitacaoService.findAvisoDoTramite(+id);
  } */

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    return this.encaminharSolicitacaoService.update(+id, updateEncaminharSolicitacaoDto);
  }


  @Put(':id/lido')
  atualizarLido(@Param('id') id: string, @Body() updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {
    return this.encaminharSolicitacaoService.update(+id, updateEncaminharSolicitacaoDto);
  }

  @Put('marcar-todas-lidas/setor/:id')
  atualizarTodosLido(@Param('id') id: string) {
    return this.encaminharSolicitacaoService.atualizarLidoTodasDoSetor(+id);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.encaminharSolicitacaoService.remove(+id);
  }


  @Delete('/remover/tramites/solicitacao/:id')
  removeTodoTramite(@Param('id') id: number) {
    return this.encaminharSolicitacaoService.removerTramitesGeral(+id);
  }
}
