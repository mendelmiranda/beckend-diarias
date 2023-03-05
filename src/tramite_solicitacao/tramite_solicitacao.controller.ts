import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TramiteSolicitacaoService } from './tramite_solicitacao.service';
import { CreateTramiteSolicitacaoDto } from './dto/create-tramite_solicitacao.dto';
import { UpdateTramiteSolicitacaoDto } from './dto/update-tramite_solicitacao.dto';

@Controller('tramite-solicitacao')
export class TramiteSolicitacaoController {
  constructor(private readonly tramiteSolicitacaoService: TramiteSolicitacaoService) {}

  @Post()
  create(@Body() createTramiteSolicitacaoDto: CreateTramiteSolicitacaoDto) {
    return this.tramiteSolicitacaoService.create(createTramiteSolicitacaoDto);
  }

  @Get()
  findAll() {
    return this.tramiteSolicitacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramiteSolicitacaoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTramiteSolicitacaoDto: UpdateTramiteSolicitacaoDto) {
    return this.tramiteSolicitacaoService.update(+id, updateTramiteSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramiteSolicitacaoService.remove(+id);
  }
}
