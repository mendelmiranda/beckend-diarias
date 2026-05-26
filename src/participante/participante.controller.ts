import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put
} from '@nestjs/common';
import { AnexoSolicitacaoService } from 'src/anexo_solicitacao/anexo_solicitacao.service';
import { Util } from 'src/util/Util';
import { CreateEventoParticipanteDto } from '../evento_participantes/dto/create-evento_participante.dto';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { ParticipanteService } from './participante.service';

@Controller('participante')
export class ParticipanteController {
  constructor(
    private readonly participanteService: ParticipanteService,
    private readonly eventoParticipanteService: EventoParticipantesService,
    private readonly anexoSolicitacao: AnexoSolicitacaoService,
  ) { }

  @Post('/evento/:id')
  async create(
    @Param('id') idEvento: number,
    @Body() createParticipanteDto: CreateParticipanteDto,
  ) {
    const dateString = createParticipanteDto.data_nascimento as any;

    const data: CreateParticipanteDto = {
      ...createParticipanteDto,
      data_nascimento:
        createParticipanteDto.tipo === 'S'
          ? new Date(dateString)
          : Util.convertToDate(dateString),
    };

    const participanteId = await this.participanteService.create(data);

    await this.eventoParticipanteService.create({
      evento_id: parseInt(String(idEvento), 10),
      participante_id: participanteId,
    });

    return participanteId;
  }

  @Get()
  findAll() {
    return this.participanteService.findAll();
  }

  @Get('/cpf/:cpf')
  pesquisarParticipantePorCpf(@Param('cpf') cpf: string) {
    return this.participanteService.pesquisarParticipantePorCpf(cpf);
  }

  @Get('/servidor/cpf/:cpf')
  pesquisarParticipanteServidorPorCpf(@Param('cpf') cpf: string) {
    return this.participanteService.pesquisarParticipanteServidorPorCpf(cpf);
  }

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participanteService.findOne(+id);
  } */

  @Put(':id/evento/:idEvento')
  async update(
    @Param('id') id: number,
    @Param('idEvento') idEvento: number,
    @Body() updateParticipanteDto: UpdateParticipanteDto,
  ) {
    const dateString = updateParticipanteDto.data_nascimento as any;

    const data: UpdateParticipanteDto = {
      ...updateParticipanteDto,
      data_nascimento: Util.convertToDate(dateString),
    };

    await this.participanteService.update(+id, data);

    await this.eventoParticipanteService.create({
      evento_id: parseInt(String(idEvento), 10),
      participante_id: +id,
    });

    return +id;
  }


  @Post('/conta/participante/s3i')
  async createParticipanteS3i(@Body() createParticipanteDto: CreateParticipanteDto) {

    const dateString = createParticipanteDto.data_nascimento as any;
    const data: CreateParticipanteDto = {
      ...createParticipanteDto,
      data_nascimento: Util.convertToDate(dateString),
    };

    return (await this.participanteService.createS3i(data));
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participanteService.remove(+id);
  }


  @Get('/listar/servidores/ativos') 
  findParticipantesEvento() {  
    return this.anexoSolicitacao.pesquisarServidoresAtivos();
  }

  @Get('/listar/servidores/ativos/cpf/:cpf')
  findParticipantesEventoPorCpf(@Param('cpf') cpf: string) {
    return this.anexoSolicitacao.pesquisarServidoresAtivosPeloCpf(cpf);
  }   

  @Get('/filtrar/listar/servidores/ativos/nome/:nome')
  findParticipantesEventoPorNome(@Param('nome') nome: string) {
    return this.anexoSolicitacao.pesquisarServidoresAtivosPeloNome(nome);
  }   

  @Get('agrupar/daofi/solicitacao/:solicitacaoId')
  async agruparParticipantes(@Param('solicitacaoId', ParseIntPipe) solicitacaoId: number) {
    return this.participanteService.listarEventosComTodasViagens(solicitacaoId);
  }


  @Get('setores/ativos')
  async listarSetoresAtivos() {
    return this.anexoSolicitacao.listarSetores();
  }

  @Get('search/cargos/todos')
  async listarCargos() {
    return this.anexoSolicitacao.listarCargos();
  }

}