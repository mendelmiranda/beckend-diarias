import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EncaminharSolicitacaoService } from './encaminhar_solicitacao.service';
import { CreateEncaminharSolicitacaoDto } from './dto/create-encaminhar_solicitacao.dto';
import { UpdateEncaminharSolicitacaoDto } from './dto/update-encaminhar_solicitacao.dto';

@Controller('encaminhar-solicitacao')
export class EncaminharSolicitacaoController {
  constructor(private readonly encaminharSolicitacaoService: EncaminharSolicitacaoService) {}

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

  @Get('/verifica/setor/:id')
  findAvisoTramitePorSetor(@Param('id') id: number) {    
    return this.encaminharSolicitacaoService.findAvisoDoTramite(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEncaminharSolicitacaoDto: UpdateEncaminharSolicitacaoDto) {    
    return this.encaminharSolicitacaoService.update(+id, updateEncaminharSolicitacaoDto);
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
