import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';

@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private readonly solicitacaoService: SolicitacaoService) {}

  @Post()
  create(@Body() createSolicitacaoDto: CreateSolicitacaoDto) {    

    let d = new Date();
    d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );

    const solicitacao: CreateSolicitacaoDto = {
      ...createSolicitacaoDto,
      datareg: d,
      status: 'NAO',
    }
    return this.solicitacaoService.create(solicitacao);
  }

  @Get()
  findAll() {
    return this.solicitacaoService.findAll();
  }

  @Get('/detalhes/:id')
  detalhes(@Param('id') id: string) {
    return this.solicitacaoService.detalhesDaSolicitacao(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitacaoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSolicitacaoDto: UpdateSolicitacaoDto) {
    return this.solicitacaoService.update(+id, updateSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.solicitacaoService.remove(+id);
  }
}
