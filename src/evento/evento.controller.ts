import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpStatus } from '@nestjs/common';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { evento } from '@prisma/client';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  create(@Body() createEventoDto: CreateEventoDto) {

    let d = new Date();
    d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );

    const cid = createEventoDto.cidade_id === 0 ? null : createEventoDto.cidade_id;
    const data: CreateEventoDto = {
      ...createEventoDto,
      datareg: d,
      cidade_id: cid,
    }
    const novoDado = this.eventoService.create(data);

    return {
      statusCode: HttpStatus.CREATED,
      data: novoDado,
    };
  }

  @Get()
  findAll() {
    return this.eventoService.findAll();
  }

  @Get('/solicitacao/:id')
  findEventosDaSolicitacao(@Param('id') id: number) {
    return this.eventoService.findEventosDaSolicitacao(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventoService.findOne(+id);
  }

  @Get('/disponiveis/menu')
  findEventosDisponiveis() {
    return this.eventoService.findEventosDisponiveis();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {   

    if(updateEventoDto.cidade_id === 0){
      const prop = 'cidade_id';
      delete updateEventoDto[prop];
      this.eventoService.update(+id, updateEventoDto);
    }

    return this.eventoService.update(+id, updateEventoDto);
  }

  @Put('/:id/custos')
  updateValores(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {   
    return this.eventoService.updateValores(+id, updateEventoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventoService.remove(+id);
  }
}