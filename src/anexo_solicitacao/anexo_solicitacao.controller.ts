import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnexoSolicitacaoService } from './anexo_solicitacao.service';
import { CreateAnexoSolicitacaoDto } from './dto/create-anexo_solicitacao.dto';
import { UpdateAnexoSolicitacaoDto } from './dto/update-anexo_solicitacao.dto';

@Controller('anexo-solicitacao')
export class AnexoSolicitacaoController {
  constructor(private readonly anexoSolicitacaoService: AnexoSolicitacaoService) {}

  @Post()
  create(@Body() createAnexoSolicitacaoDto: CreateAnexoSolicitacaoDto) {
    return this.anexoSolicitacaoService.create(createAnexoSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.anexoSolicitacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.anexoSolicitacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnexoSolicitacaoDto: UpdateAnexoSolicitacaoDto) {
    return this.anexoSolicitacaoService.update(+id, updateAnexoSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.anexoSolicitacaoService.remove(+id);
  }
}
