import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
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

const TIMEOUT_DURATION = 10000; // 10 segundos
const TIMEOUT_ERROR_MESSAGE = 'Operation timed out';
const GENERIC_ERROR_MESSAGE = 'Ocorreu algo errado';

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

      if (!this.verificaColaborador(resultado.solicitacao_id)) {

        this.salvaSolicitado(createTramiteDto.status, solicitacaoId);

      }
    }
    return 0;
  }



// Função para criar exceções HTTP
createHttpException(message: string, status: HttpStatus): HttpException {
  return new HttpException({
    status: 'error',
    message,
  }, status);
}

async salvaSolicitado(status: string, solicitacaoId: number) {
  // Criação da promessa de timeout
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(this.createHttpException(TIMEOUT_ERROR_MESSAGE, HttpStatus.REQUEST_TIMEOUT)), TIMEOUT_DURATION);
  });

  if (status === "SOLICITADO") {
    try {
      const resultadosViagem = await this.viagemService.calculaDiasParaDiaria(solicitacaoId);
      
      const newItemPromise = Promise.all(resultadosViagem.map(async result => {
        await this.cadastraValoresDaDiaria(result.viagem, result.participante.id, result.evento.id, result.totalDias);
      }));

      const newItem = await Promise.race([newItemPromise, timeout]);
      return { status: 'success', data: newItem };

    } catch (error) {
      if (!(error instanceof HttpException)) {
        throw this.createHttpException(error.message || GENERIC_ERROR_MESSAGE, HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }
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
          ep.evento_participantes.some(part => part.participante.tipo === 'S')
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

  @Get('/todas/solicitacao/:id')
  findTramitesDaSolicitracao(@Param('id') id: string) {
    return this.tramiteService.findTramitesDaSolicitacao(+id);
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

  @Put('/:id/reverter/status')
  updateStatusAoReverterTramite(
    @Param('id') id: string,
    @Body() dto: UpdateTramiteDto,
  ) {

    console.log('dto', dto);

    return this.tramiteService.updateStatusAoReverterTramite(+id, dto);
  }


}
