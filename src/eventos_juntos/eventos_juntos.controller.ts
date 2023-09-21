import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { EventosJuntosService } from './eventos_juntos.service';
import { CreateEventosJuntoDto } from './dto/create-eventos_junto.dto';
import { UpdateEventosJuntoDto } from './dto/update-eventos_junto.dto';

@Controller('eventos-juntos')
export class EventosJuntosController {
  constructor(private readonly eventosJuntosService: EventosJuntosService) {}

  @Post()
  create(@Body() createEventosJuntoDto: CreateEventosJuntoDto) {
    return this.eventosJuntosService.create(createEventosJuntoDto);
  }

  @Get('/solicitacao/:id')
  findAll(@Param('id') id: string) {
    return this.eventosJuntosService.findAllBySolicitacaoId(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return null//this.eventosJuntosService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventosJuntoDto: UpdateEventosJuntoDto) {
    return this.eventosJuntosService.update(+id, updateEventosJuntoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventosJuntosService.remove(+id);
  }
}
