import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { TramiteService } from './tramite.service';
import { ViagemService } from 'src/viagem/viagem.service';
import { EventoParticipantesService } from 'src/evento_participantes/evento_participantes.service';

@Controller('tramite')
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService, private readonly viagemService: ViagemService, private readonly eParticipanteService: EventoParticipantesService) { }

  @Post('/:id/:nome')
  async create(@Param('id') id: string, @Param('nome') nome: string, @Body() createTramiteDto: CreateTramiteDto) {
    const parsedId = +id;

    if (parsedId > 0) {
      await this.tramiteService.update(parsedId, createTramiteDto, nome);

    } else {
      const resultado = await this.tramiteService.create(createTramiteDto, nome);
      const solicitacaoId = resultado.solicitacao_id;

      if (!await this.verificaColaborador(resultado.solicitacao_id)) {

        if (createTramiteDto.status === 'SOLICITADO') {
          const resultadosViagem = await this.viagemService.calculaDiasParaDiaria(solicitacaoId);
          await Promise.all(
            resultadosViagem.map(async (result) => {
              await this.cadastraValoresDaDiaria(result.viagem, result.participante.id, result.evento.id, result.totalDias);
            }),
          );
        }
      }
    }
    return 0;
  }

  async cadastraValoresDaDiaria(idViagem: number, participanteId: number, eventoId: number, total: number) {
    return await this.viagemService.calculaDiaria(idViagem, participanteId, eventoId, total);
  }

  async verificaColaborador(solicitacaoId: number): Promise<boolean> {
    try {
      const resultado = await this.tramiteService.findOneSolicitacaoColaborador(solicitacaoId);
  
      // Verifica se algum dos eventos contém um participante do tipo 'S'.
      const temParticipanteTipoS = resultado.some(eventos =>
        eventos.eventos.some(ep =>
          ep.evento_participantes.some(part => part.participante.tipo === 'C' || part.participante.tipo === 'T')
        )
      );      
  
      return temParticipanteTipoS;
    } catch (error) {
      console.error("Erro ao verificar colaborador", error);
      throw error; // Relança o erro ou trata conforme necessário.
    }
    
  }

  @Get()
  findAll() {
    return this.tramiteService.findAll();
  }

  @Get('/verifica/notificacao')
  findTramiteNotificacao() {
    return this.tramiteService.findTramiteParaNoticiacao();
  }

  @Get('/solicitacao/:id')
  findTramiteSolicitracao(@Param('id') id: string) {
    return this.tramiteService.findOneSolicitacao(+id);
  }

  @Get('/lotacao/:id')
  findTramitePorLocatacao(@Param('id') id: string) {
    return this.tramiteService.findTramitePorLotacao(+id);
  }

  @Get('/lotacao/:id/origem')
  findTramitePorLocatacaoNaOrigem(@Param('id') id: string) {
    return this.tramiteService.findTramitePorLotacaoAprovadosDaOrigem(+id);
  }

  @Get('/presidencia/todos')
  findTramitePresidencia() {
    return this.tramiteService.findTramitePresidencia();
  }

  @Get('/solicitacoes/empenhados')
  findEmpenhados() {
    return this.tramiteService.findEmpenhados();
  }

  @Get('/solicitacoes/concluidas')
  findConcluidas() {
    return this.tramiteService.findConcluidas();
  }

  @Get('/envia-email')
  enviaEmail() {
    //this.tramiteService.enviarNotificacaoDoStatus("SOLICITADO", "12");
    return HttpStatus.OK;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramiteService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTramiteDto: UpdateTramiteDto) {
    return this.tramiteService.update(+id, updateTramiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramiteService.remove(+id);
  }

  @Put('/status/:id/:nome')
  updateStatus(
    @Param('id') id: string,
    @Param('nome') nome: string,
    @Body() dto: CreateTramiteDto,
  ) {
    return this.tramiteService.updateStatus(+id, 'RECUSADO', nome, dto);
  }
}
