import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventoParticipantesService } from './evento_participantes.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';

@Controller('evento-participantes')
export class EventoParticipantesController {
  constructor(
    private readonly eventoParticipantesService: EventoParticipantesService,
  ) {}

  @Post()
  create(@Body() createEventoParticipanteDto: CreateEventoParticipanteDto) {
    return this.eventoParticipantesService.create(createEventoParticipanteDto);
  }

  @Get()
  findAll() {
    return this.eventoParticipantesService.findAll();
  }

  @Get('/evento/:id')
  findParticipantesDoEvento(@Param('id') id: number) {
    return this.eventoParticipantesService.findParticipantesDoEvento(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventoParticipantesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventoParticipanteDto: UpdateEventoParticipanteDto,
  ) {
    return this.eventoParticipantesService.update(
      +id,
      updateEventoParticipanteDto,
    );
  }

  /* @Delete('/evento/:idEvento/participante/:idParticipante')
  remove(@Param('idEvento') idEvento: number, @Param('idParticipante') idParticipante: number) {
    return this.eventoParticipantesService.remove(+idEvento, +idParticipante);
  } */

  @Delete('/evento/:id')
  remove(@Param('id') id: number) {
    return this.eventoParticipantesService.remove(+id);
  }
}
