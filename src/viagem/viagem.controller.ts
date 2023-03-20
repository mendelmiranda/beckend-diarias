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
    
    const viagem = await this.viagemService.create(createViagemDto);

        
    const viagem_participante: CreateViagemParticipanteDto = {
      evento_participantes_id: +id,
      viagem_id: viagem.id,
      datareg: new Date(),      
    }

    await this.viagemParticipanteService.create(viagem_participante);    

    return await this.atualizarDiaria(viagem.id, id);
  }

  async atualizarDiaria(idViagem: number, idEventoParticipante: number){
    const totalDiaria = await this.viagemService.calculaDiaria(idViagem, idEventoParticipante);
    const findViagem = (await this.viagemService.findOne(idViagem));  

    console.log('total diaria', totalDiaria);
    

   /*  const updateViagem: UpdateViagemDto = {
      valor_diaria: totalDiaria,
    }    

  return this.viagemService.update(idViagem, updateViagem);   */  

  return totalDiaria;
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
