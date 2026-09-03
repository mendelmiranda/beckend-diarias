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
  Query,
} from '@nestjs/common';
import { CreateLogTramiteDto } from 'src/log_tramite/dto/create-log_tramite.dto';
import { ViagemService } from 'src/viagem/viagem.service';
import { ResultadoCalculoDiariasDto } from 'src/viagem/dto/resultado-calculo-diarias.dto';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { PesquisaSolicitacoesEmpenhadasDto } from './dto/pesquisa-solicitacoes-empenhadas.dto';
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

export type UpsertTramiteResponse = {
  success: boolean;
  calculou: boolean;
  total?: number;
  elegiveis?: number;
  falhas?: ResultadoCalculoDiariasDto['falhas'];
};

@Controller('tramite')
export class TramiteController {
  constructor(
    private readonly tramiteService: TramiteService,
    private readonly viagemService: ViagemService,
  ) { }

  /**
   * POST /tramite/recalcular-diarias/:solicitacaoId
   * Recalcula e persiste diárias sem criar trâmite.
   */
  @Post('recalcular-diarias/:solicitacaoId')
  @HttpCode(200)
  async recalcularDiarias(
    @Param('solicitacaoId', ParseIntPipe) solicitacaoId: number,
  ): Promise<ResultadoCalculoDiariasDto> {
    try {
      return await this.viagemService.calcularEPersistirDiarias(solicitacaoId);
    } catch (error: any) {
      throw new InternalServerErrorException(error?.message ?? error);
    }
  }

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
  ): Promise<UpsertTramiteResponse> {
    try {
      if (id > 0) {
        await this.tramiteService.update(id, dto, nome);
        return { success: true, calculou: false };
      }

      const created = await this.tramiteService.create(dto, nome);

      const deveCalcular = dto.status === TramiteStatus.SOLICITADO;

      if (!deveCalcular) {
        return { success: true, calculou: false };
      }

      const resultado = await this.viagemService.calcularEPersistirDiarias(
        created.solicitacao_id,
      );

      return {
        success: true,
        calculou: resultado.calculou,
        total: resultado.total,
        elegiveis: resultado.elegiveis,
        falhas: resultado.falhas.length > 0 ? resultado.falhas : undefined,
      };
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
  findEmpenhados(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('numero') numero?: string,
    @Query('solicitante') solicitante?: string,
  ) {
    const filtro: PesquisaSolicitacoesEmpenhadasDto = {
      pagina: pagina ? Number(pagina) : undefined,
      limite: limite ? Number(limite) : undefined,
      numero,
      solicitante,
    };

    return this.tramiteService.findEmpenhados(filtro);
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
}
