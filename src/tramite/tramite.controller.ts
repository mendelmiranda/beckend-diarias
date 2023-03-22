import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { TramiteSolicitacaoService } from './tramite.service';

@Controller('tramite-solicitacao')
export class TramiteSolicitacaoController {
  constructor(private readonly tramiteSolicitacaoService: TramiteSolicitacaoService) {}

  @Post()
  create(@Body() createTramiteSolicitacaoDto: CreateTramiteDto) {

    const data: CreateTramiteDto = {
      ...createTramiteSolicitacaoDto,
      datareg: new Date(),
    }

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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTramiteSolicitacaoDto: UpdateTramiteDto) {
    return this.tramiteSolicitacaoService.update(+id, updateTramiteSolicitacaoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramiteSolicitacaoService.remove(+id);
  }
}
