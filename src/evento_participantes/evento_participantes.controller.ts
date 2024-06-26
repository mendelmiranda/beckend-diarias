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

  @Get('/participante/cpf/:cpf')
  findParticipantesDoEventoInfo(@Param('cpf') cpf: string) {
    return this.eventoParticipantesService.findParticipanteDoEventoInfo(cpf);
  }

  @Get('/viagem/por/evento/id/:id')
  async findParticipantesAgrupadosPorEvento(@Param('id') id: number) {

    const dados = await this.eventoParticipantesService.buscarParticipantesEvento(id);    

    const agrupadosPorOrigemDestino = dados.reduce((acc, item) => {
      const viagemInfo = item.viagem_participantes[0].viagem;
      const chave = `${viagemInfo.origem.id}-${viagemInfo.destino.id}`;
  
      if (!acc[chave]) {
          acc[chave] = {
              origem: viagemInfo.origem.cidade,
              destino: viagemInfo.destino.cidade,
              data_ida: viagemInfo.data_ida,
              data_volta: viagemInfo.data_volta,
              participantes: []
          };
      }
  
      acc[chave].participantes.push({
          nome: item.participante.nome
      });
  
      return acc;
  }, {});

    return agrupadosPorOrigemDestino;
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
