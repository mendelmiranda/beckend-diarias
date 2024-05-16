import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PortariaSolicitacaoService } from './portaria_solicitacao.service';
import { CreatePortariaSolicitacaoDto } from './dto/create-portaria_solicitacao.dto';
import { UpdatePortariaSolicitacaoDto } from './dto/update-portaria_solicitacao.dto';

@Controller('portaria-solicitacao')
export class PortariaSolicitacaoController {
  constructor(private readonly portariaSolicitacaoService: PortariaSolicitacaoService) {}

  @Post()
  create(@Body() createPortariaSolicitacaoDto: CreatePortariaSolicitacaoDto) {
    return this.portariaSolicitacaoService.create(createPortariaSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.portariaSolicitacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.portariaSolicitacaoService.findOne(+id);
  }

  @Get('/solicitacoes')
  findSolicitacaoSemPortaria() {
    return this.portariaSolicitacaoService.findSolicitacoesSemPortariaCadastrada();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePortariaSolicitacaoDto: UpdatePortariaSolicitacaoDto) {
    return this.portariaSolicitacaoService.update(+id, updatePortariaSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.portariaSolicitacaoService.remove(+id);
  }
}
