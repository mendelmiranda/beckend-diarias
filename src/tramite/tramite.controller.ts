import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { EventoParticipantesService } from 'src/evento_participantes/evento_participantes.service';
import { CreateLogTramiteDto } from 'src/log_tramite/dto/create-log_tramite.dto';
import { ViagemService } from 'src/viagem/viagem.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { TramiteService } from './tramite.service';

/**
 * Consolidated definition of explicit status strings used across the controller.
 * Moving magic strings to a shared enum helps catch typos and makes refactors easier.
 */
export enum TramiteStatus {
  SOLICITADO = 'SOLICITADO',
  RECUSADO = 'RECUSADO',
}

@Controller('tramite')
export class TramiteController {
  constructor(
    private readonly tramiteService: TramiteService,
    private readonly viagemService: ViagemService,
    private readonly eParticipanteService: EventoParticipantesService, // ⚠ TODO: consider renaming
  ) {}

  /**
   * POST /tramite/:id/:nome
   * Up‑serts (create or update) a trâmite depending on the numeric value of :id.
   */
  @Post(':id/:nome')
  @HttpCode(200)
  async upsert(
    @Param('id', ParseIntPipe) id: number,
    @Param('nome') nome: string,
    @Body() dto: CreateTramiteDto,
  ): Promise<{ success: boolean }> {
    try {
      if (id > 0) {
        await this.tramiteService.update(id, dto, nome);
        return { success: true };
      }

      const created = await this.tramiteService.create(dto, nome);

      const possuiColaborador = await this.hasColaborador(created.solicitacao_id);

      if (!possuiColaborador && dto.status === TramiteStatus.SOLICITADO) {
        const viagens = await this.viagemService.calculaDiasParaDiaria(
          created.solicitacao_id,
        );

        await Promise.all(
          viagens.map((v) =>
            this.viagemService.calculaDiaria(
              v.viagem,
              v.participante.id,
              v.evento.id,
              v.totalDias,
              created.solicitacao_id,
            ),
          ),
        );
      }

      return { success: true };
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message ?? error);
    }
  }

  /* ---------------------------------------------------------------------------
   * READ‑ONLY ENDPOINTS
   * -------------------------------------------------------------------------*/

  @Get()
  findAll() {
    return this.tramiteService.findAll();
  }

  @Get('verifica/notificacao')
  findTramiteNotificacao() {
    return this.tramiteService.findTramiteParaNoticiacao();
  }

  @Get('solicitacao/:id')
  findTramiteSolicitacao(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.findOneSolicitacao(id);
  }

  @Get('todas/solicitacao/:id')
  findTramitesDaSolicitacao(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.findTramitesDaSolicitacao(id);
  }

  @Get('lotacao/:id')
  findTramitePorLotacao(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.findTramitePorLotacao(id);
  }

  @Get('lotacao/:id/origem')
  findTramitePorLotacaoNaOrigem(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.findTramitePorLotacaoAprovadosDaOrigem(id);
  }

  @Get('presidencia/todos')
  findTramitePresidencia() {
    return this.tramiteService.findTramitePresidencia();
  }

  @Get('solicitacoes/empenhados')
  findEmpenhados() {
    return this.tramiteService.findEmpenhados();
  }

  @Get('solicitacoes/concluidas')
  findConcluidas() {
    return this.tramiteService.findConcluidas();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.findOne(id);
  }

  @Get('solicitacao/login/:login')
  localizarSolicitacoesPeloLogin(@Param('login') login: string) {
    return this.tramiteService.listarSolicitacoesPeloLogin(login);
  }

  /* ---------------------------------------------------------------------------
   * UPDATE ENDPOINTS
   * -------------------------------------------------------------------------*/

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTramiteDto) {
    return this.tramiteService.update(id, dto);
  }

  @Put('daof/lido/tramite/:id')
  updateLidoDAOF(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.updateDAOFLido(id);
  }

  @Put('status/:id/:nome')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('nome') nome: string,
    @Body() dto: CreateTramiteDto,
  ) {
    return this.tramiteService.updateStatus(id, TramiteStatus.RECUSADO, nome, dto);
  }

  @Put('reverter/status/:id')
  updateStatusAoReverterTramite(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTramiteDto,
  ) {
    return this.tramiteService.updateStatusAoReverterTramite(id, dto);
  }

  /* ---------------------------------------------------------------------------
   * DELETE ENDPOINT
   * -------------------------------------------------------------------------*/

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tramiteService.remove(id);
  }

  /* ---------------------------------------------------------------------------
   * DOMAIN‑SPECIFIC AUXILIARY ENDPOINTS
   * -------------------------------------------------------------------------*/

  @Get('envia-email')
  enviaEmail() {
    // TODO: move this to a dedicated Notifications module/service.
    return 200;
  }

  @Get('consulta/detalhes/servidor/:cpf')
  pesquisaServidor(@Param('cpf') cpf: string) {
    return this.tramiteService.pesquisaServidorGOVBR(cpf);
  }

  @Post('processar/encaminhamento/log-tramite/:logTramiteId/solicitacao/:solicitacaoId')
  processarEncaminhamento(
    @Param('logTramiteId', ParseIntPipe) logTramiteId: number,
    @Param('solicitacaoId', ParseIntPipe) solicitacaoId: number,
    @Body() dto: CreateLogTramiteDto,
  ) {
    return this.tramiteService.voltaSolicitacaoParaDeterminadoSetor(
      logTramiteId,
      solicitacaoId,
      dto,
    );
  }

  /* ---------------------------------------------------------------------------
   * PRIVATE HELPERS (controller scope)
   * Consider moving them to a Domain Service if reused elsewhere.
   * -------------------------------------------------------------------------*/

  private async hasColaborador(solicitacaoId: number): Promise<boolean> {
    const eventos =
      await this.tramiteService.findOneSolicitacaoColaborador(solicitacaoId);

    return eventos.some((e) =>
      e.eventos.some((ep) =>
        ep.evento_participantes.some((p) =>
          ['C', 'T'].includes(p.participante.tipo),
        ),
      ),
    );
  }
}
