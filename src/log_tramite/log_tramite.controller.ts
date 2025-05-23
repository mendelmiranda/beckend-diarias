import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogTramiteService } from './log_tramite.service';
import { CreateLogTramiteDto } from './dto/create-log_tramite.dto';
import { UpdateLogTramiteDto } from './dto/update-log_tramite.dto';

@Controller('log-tramite')
export class LogTramiteController {
  constructor(private readonly logTramiteService: LogTramiteService) {}

  @Post()
  create(@Body() createLogTramiteDto: CreateLogTramiteDto) {
    return this.logTramiteService.create(createLogTramiteDto);
  }

  @Get()
  findAll() {
    return this.logTramiteService.findAll();
  }

  @Get('/pesquisa/status/:status')
  findLogsDaSolicitacaoPorStatus(@Param('status') status: string) {
    return this.logTramiteService.findTodosPorStatus(status);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logTramiteService.findOne(+id);
  }

  @Get('/solicitacao/:id')
  findLogsDaSolicitacaoPorSolicitacaoId(@Param('id') id: string) {
    return this.logTramiteService.findLogsTramiteSolicitacao(+id);
  }

  @Get('/lotacao/:id')
  findLogsDaSolicitacaoPorLotacaoId(@Param('id') id: string) {
    return this.logTramiteService.findLogsTramitePorLotacao(+id);
  }

  @Get('/presidencia/solicitacoes/finalizadas')
  findLogsDaSolicitacaoFinalizada(@Param('id') id: string) {
    return this.logTramiteService.findLogsTramiteFinalizado();
  }

  @Get('/lotacao/:id/destino')
  findLogsDaSolicitacaoPorLotacaoIdDestino(@Param('id') id: string) {
    return this.logTramiteService.findLogsTramitePorLotacaoDestino(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogTramiteDto: UpdateLogTramiteDto) {
    return this.logTramiteService.update(+id, updateLogTramiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logTramiteService.remove(+id);
  }
}
