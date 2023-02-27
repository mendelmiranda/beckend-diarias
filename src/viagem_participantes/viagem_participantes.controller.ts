import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViagemParticipantesService } from './viagem_participantes.service';
import { CreateViagemParticipanteDto } from './dto/create-viagem_participante.dto';
import { UpdateViagemParticipanteDto } from './dto/update-viagem_participante.dto';

@Controller('viagem-participantes')
export class ViagemParticipantesController {
  constructor(private readonly viagemParticipantesService: ViagemParticipantesService) {}

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViagemParticipanteDto: UpdateViagemParticipanteDto) {
    return this.viagemParticipantesService.update(+id, updateViagemParticipanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viagemParticipantesService.remove(+id);
  }
}
