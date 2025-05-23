import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { CreateViagemDto } from './dto/create-viagem.dto';
import { UpdateViagemDto } from './dto/update-viagem.dto';
import { ViagemParticipantesService } from '../viagem_participantes/viagem_participantes.service';
import { CreateViagemParticipanteDto } from 'src/viagem_participantes/dto/create-viagem_participante.dto';
import { evento } from '@prisma/client';

@Controller('viagem')
export class ViagemController {
  constructor(private readonly viagemService: ViagemService,
    private readonly viagemParticipanteService: ViagemParticipantesService) {}

  @Post('/evento_participantes/:id')
  async create(@Param('id') id: number, @Body() createViagemDto: CreateViagemDto) {

    try{

      const eventoId = createViagemDto['eventoId'];

    const prop = 'eventoId';
    delete createViagemDto[prop];
    
    const viagem = await this.viagemService.create(createViagemDto);
            
    const viagem_participante: CreateViagemParticipanteDto = {
      evento_participantes_id: +id,
      viagem_id: viagem.id,
      datareg: new Date(),      
    }

    return await this.viagemParticipanteService.create(viagem_participante);       
    }catch(e){
      console.log('erro', e);

    }
  }

  @Get('/simula/agrupamento/:id')
  findSimula(@Param('id') id: number) {   
    return this.viagemService.calculaDiasParaDiaria(+id);
  }

 
  @Get('/evento/:id')
  findViagemEvento(@Param('id') id: number) {   
    return this.viagemParticipanteService.findParticipantesViagemDoEvento(+id);
  }

  @Get('/todas/solicitacao/:id')
  findViagemPorSolicitacao(@Param('id') id: number) {   
    return this.viagemService.findViagemPorSolicitacao(+id);
  }


  @Get('/eventos/participantes/solicitacao/:id')
  findParticipantesDaViagemPorSolicitacao(@Param('id') id: number) {   
    return this.viagemService.participantesAgrupadosPorEvento(+id);
  }

  @Get()
  findAll() {
    return this.viagemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.viagemService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateViagemDto: UpdateViagemDto) {
    return this.viagemService.atualizarDiariaColaborador(+id, updateViagemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.viagemService.remove(+id);
  }

  @Post('/v2/nova/:eventoId')
  async createViagem(@Param('eventoId') eventoId: number, @Body() createViagemDto: CreateViagemDto) {    
    return await this.viagemService.createNova(createViagemDto, eventoId);  
  }

  @Get(':id/participantes')
  async listarParticipantesPorEvento(@Param('id', ParseIntPipe) eventoId: number) {
    return this.viagemService.getParticipantesByEventoOtimizado(eventoId);
  }


  @Get('/total/passagem/solicitacao/:id')
  async total(@Param('id', ParseIntPipe) eventoId: number) {
    return this.viagemService.getTotalPassagemPorSolicitacao(eventoId);
  }

  @Get('solicitacao/:id/tem-passagem/eficiente')
  async verificarTemPassagemEficiente(@Param('id', ParseIntPipe) solicitacaoId: number) {
    const temPassagem = await this.viagemService.verificarPassagemEficiente(solicitacaoId);
    
    return {
      solicitacaoId,
      temPassagem
    };
  }

}
