import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViagemEventoService } from './viagem_evento.service';
import { CreateViagemEventoDto } from './dto/create-viagem_evento.dto';
import { UpdateViagemEventoDto } from './dto/update-viagem_evento.dto';

@Controller('viagem-evento')
export class ViagemEventoController {
  constructor(private readonly viagemEventoService: ViagemEventoService) {}

  @Post()
  create(@Body() createViagemEventoDto: CreateViagemEventoDto) {
    return this.viagemEventoService.create(createViagemEventoDto);
  }

  @Get()
  findAll() {
    return this.viagemEventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viagemEventoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViagemEventoDto: UpdateViagemEventoDto) {
    return this.viagemEventoService.update(+id, updateViagemEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viagemEventoService.remove(+id);
  }
}
