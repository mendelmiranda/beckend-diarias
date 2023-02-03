import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TipoEventoService } from './tipo_evento.service';
import { CreateTipoEventoDto } from './dto/create-tipo_evento.dto';
import { UpdateTipoEventoDto } from './dto/update-tipo_evento.dto';

@Controller('tipo-evento')
export class TipoEventoController {
  constructor(private readonly tipoEventoService: TipoEventoService) {}

  @Post()
  create(@Body() createTipoEventoDto: CreateTipoEventoDto) {
    return this.tipoEventoService.create(createTipoEventoDto);
  }

  @Get()
  findAll() {
    return this.tipoEventoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoEventoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTipoEventoDto: UpdateTipoEventoDto,
  ) {
    return this.tipoEventoService.update(+id, updateTipoEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoEventoService.remove(+id);
  }
}
