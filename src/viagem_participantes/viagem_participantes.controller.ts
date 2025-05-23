import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ViagemParticipantesService } from './viagem_participantes.service';
import { CreateViagemParticipanteDto } from './dto/create-viagem_participante.dto';
import { UpdateViagemParticipanteDto } from './dto/update-viagem_participante.dto';

@Controller('viagem-participantes')
export class ViagemParticipantesController {
  constructor(
    private readonly viagemParticipantesService: ViagemParticipantesService,
  ) { }

  @Post()
  create(@Body() createViagemParticipanteDto: CreateViagemParticipanteDto) {
    return this.viagemParticipantesService.create(createViagemParticipanteDto);
  }

  @Get()
  findAll() {
    return this.viagemParticipantesService.findAll();
  }

  @Get('/evento/:id')
  carregarViagemPorEvento(@Param('id') id: number) {
    return this.viagemParticipantesService.findParticipantesViagemDoEvento(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viagemParticipantesService.findOne(+id);
  }

  //novo
  @Get('/viagem/evento-participante/:id')
  findViagemDoParticipante(@Param('id') id: string) {
    return this.viagemParticipantesService.findViagemDoParticipantePeloId(+id);
  }

  @Get('/participantes/viagem/novos/:id')
  findParticipantesDaViagem(@Param('id') id: string) {
    return this.viagemParticipantesService.findParticipantesDaViagemPorId(+id);
  }

  @Put(':id')
  update(@Param('id') id: string,@Body() updateViagemParticipanteDto: UpdateViagemParticipanteDto,) {

    try {
      return this.viagemParticipantesService.update(+id, updateViagemParticipanteDto);
    } catch (e) {
      console.log('erro', e);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viagemParticipantesService.remove(+id);
  }
}
