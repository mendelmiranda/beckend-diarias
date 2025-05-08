import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { EventoService } from './evento.service';

@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) { }

  @Post()
  create(@Body() createEventoDto: CreateEventoDto) {

    let d = new Date();
    d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    const cid = createEventoDto.cidade_id === 0 ? null : createEventoDto.cidade_id;
    const data: CreateEventoDto = {
      ...createEventoDto,
      datareg: d,
      cidade_id: cid,
    }
    return this.eventoService.create(data);
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

  @Get('/futuros/presidencia')
  findEventosFuturos() {
    return this.eventoService.findEventosFuturos();
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateEventoDto: UpdateEventoDto) {

    if (updateEventoDto.cidade_id === 0) {
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


  @Get('/verifica/solicitacao/:id')
  findVerificaViagemSolicitacao(@Param('id') id: number) {
    return this.eventoService.verificarParticipantesComViagemPorSolicitacao(+id);
  }

  @Post('verificar-duplicado')
  async verificarDuplicado(@Body() params: {
    titulo: string;
    inicio: string | Date;
    fim: string | Date;
    tipo_evento_id: number;
    cidade_id?: number;
    exterior: string;
    pais_id?: number;
    local_exterior?: string;
    id_atual?: number;
    solicitacao_id: number;
  }) {
    try {
      // Converter strings de data para objetos Date
      const paramsConvertidos = {
        ...params,
        inicio: new Date(params.inicio),
        fim: new Date(params.fim),
      };

      const resultado = await this.eventoService.verificarDuplicado(paramsConvertidos);
      return resultado;
    } catch (error) {
      throw new HttpException(
        { error: 'Erro ao verificar duplicidade do evento', details: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Get('/dashboard/top-eventos')
  listarTop3() {
    return this.eventoService.getTopEventTypes();
  }

  @Get('/dashboard/top/cidades')
  async getCidadesMaisSolicitadas() {
    let resultado: any;

    try {
       resultado = await this.eventoService.getCidadesMaisSolicitadas();

      console.log('Resultado do controller:', resultado);      

      
    } catch (error) {
      console.error('Erro no controller:', error);
  
      // Retorna erro com mensagem clara e status 500
      throw new HttpException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro ao buscar cidades mais solicitadas',
        error: error.message,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

      return resultado;
  }


}