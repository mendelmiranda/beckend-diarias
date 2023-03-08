import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { CreateViagemParticipanteDto } from 'src/viagem_participantes/dto/create-viagem_participante.dto';

@Controller('viagem')
export class ViagemController {
  constructor(private readonly viagemService: ViagemService,
    private readonly viagemParticipanteService: ViagemParticipantesService) {}

  @Post('/evento_participantes/:id')
  async create(@Param('id') id: number, @Body() createViagemDto: CreateViagemDto) {
    
    const viagem = (await this.viagemService.create(createViagemDto)).id;

    const viagem_participante: CreateViagemParticipanteDto = {
      evento_participantes_id: +id,
      viagem_id: viagem,
      datareg: new Date(),      
    }

    this.viagemService.calculaDiaria(viagem, id);

    await this.viagemParticipanteService.create(viagem_participante);    

    return;
  }

  @Get('/evento/:id')
  findViagemEvento(@Param('id') id: number) {   
    return this.viagemParticipanteService.findParticipantesViagemDoEvento(+id);
  }

  @Get()
  findAll() {
    return this.viagemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viagemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateViagemDto: UpdateViagemDto) {
    return this.viagemService.update(+id, updateViagemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viagemService.remove(+id);
  }
}
