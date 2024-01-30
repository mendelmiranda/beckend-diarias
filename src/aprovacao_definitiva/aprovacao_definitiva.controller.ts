import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AprovacaoDefinitivaService } from './aprovacao_definitiva.service';
import { CreateAprovacaoDefinitivaDto } from './dto/create-aprovacao_definitiva.dto';
import { UpdateAprovacaoDefinitivaDto } from './dto/update-aprovacao_definitiva.dto';

@Controller('aprovacao-definitiva')
export class AprovacaoDefinitivaController {
  constructor(private readonly aprovacaoDefinitivaService: AprovacaoDefinitivaService) {}

  @Post()
  create(@Body() createAprovacaoDefinitivaDto: CreateAprovacaoDefinitivaDto) {
    return this.aprovacaoDefinitivaService.create(createAprovacaoDefinitivaDto);
  }

  @Get('/assinatura-presidente')
  findAssinatura(@Param('id') id: number) {
    return this.aprovacaoDefinitivaService.findAssinaturaPresidente(id);
  }

  @Get()
  findAll() {
    return this.aprovacaoDefinitivaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aprovacaoDefinitivaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAprovacaoDefinitivaDto: UpdateAprovacaoDefinitivaDto) {
    return this.aprovacaoDefinitivaService.update(+id, updateAprovacaoDefinitivaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aprovacaoDefinitivaService.remove(+id);
  }
}
