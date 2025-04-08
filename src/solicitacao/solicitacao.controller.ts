import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Req
} from '@nestjs/common';
import { ConsultaSetoresDto } from './dto/consulta-setores.dto';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import PesquisaSolicitacaoDTO from './dto/pesquisa-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import { Solicitacao } from './entities/solicitacao.entity';
import { SolicitacaoService } from './solicitacao.service';
import { PathParamsDto } from './dto/path-params.dto';
import { DiariasResponseDto } from './dto/response.dto';
import { SolicitacaoIdDto } from './dto/solicitacao-id.dto';

@Controller('solicitacao')
export class SolicitacaoController {
  constructor(private readonly solicitacaoService: SolicitacaoService) {}

  @Post()
  create(@Body() createSolicitacaoDto: CreateSolicitacaoDto, @Req() request: Request) {
    const usuario = JSON.parse(request.headers['dados_client']);
    
    let d = new Date();
    d.setTime(d.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

    const solicitacao: CreateSolicitacaoDto = {
      ...createSolicitacaoDto,
      datareg: d,
      status: 'NAO',
    };
    
    return this.solicitacaoService.create(solicitacao, usuario);    
  }

  @Post('/consulta/setores')
  listarSolicitacaoPorSetores(@Body() consulta: ConsultaSetoresDto) {    
    return this.solicitacaoService.findSolicitacoesDeAcordoComSetor(consulta);
  }

  @Get()
  findAll() {
    return this.solicitacaoService.findAll();
  }

  @Get('/lotacao/:id')
  findSolicitacaoPorLotacao(@Param('id') id: string) {
    return this.solicitacaoService.findAllByLotacao(+id);
  }

  @Get('/todas/login/:login')
  findSolicitacaoPorLogin(@Param('login') login: string) {
    return this.solicitacaoService.findAllByLogin(login);
  }

  @Get('/detalhes/:id')
  detalhes(@Param('id') id: string) {
    return this.solicitacaoService.detalhesDaSolicitacao(+id);
  }

  @Get('/responsaveis')
  listarResponsaveisDaSolicitacao() {
    return this.solicitacaoService.pesquisarResponsaveis();
  }

  @Get('/andamento/editaveis')
  listarSolicitacoesEditaveis() {
    return this.solicitacaoService.getSolicitacoesEditaveis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitacaoService.findOne(+id);
  }

  @Put(':id')
  update( @Param('id') id: string, @Body() updateSolicitacaoDto: UpdateSolicitacaoDto, @Req() request: Request ) {
    const usuario = JSON.parse(request.headers['dados_client']);

    return this.solicitacaoService.update(+id, updateSolicitacaoDto, usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuario = JSON.parse(request.headers['dados_client']);

    return this.solicitacaoService.remove(+id, usuario);
  }

  @Delete('/remover-tudo/:id')
  removeDARAD(@Param('id') id: string, @Req() request: Request) {
    const usuario = JSON.parse(request.headers['dados_client']);

    return this.solicitacaoService.removeDARAD(+id, usuario);
  }


  @Post('/pesquisar')
  pesquisarSolicitacoes(@Body() dto: PesquisaSolicitacaoDTO) {   

    if(parseInt(dto.numero) > 0 && dto.dataInicio === undefined) {
      return this.solicitacaoService.pesquisarSolicitacaoPorNumero(+dto.numero);
    }
    return this.solicitacaoService.pesquisarSolicitacoes(dto);
  }


  @Get('/pesquisa/transparencia/resultado/')
  async findTransparencia(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ data: Solicitacao[], total: number }> {
    const solicitacoes = await this.solicitacaoService.getSolicitacoesTransparencia(page, limit);
    const total = await this.solicitacaoService.getSolicitacoesCount();

    return {
      data: solicitacoes,
      total,
    };
  }

  @Get('eventos/solicitacao/:solicitacao_id/participante/:participante_id')
  async getEventosParticipante(@Param() params: PathParamsDto): Promise<DiariasResponseDto> {
    try {
      return await this.solicitacaoService.getEventosParticipante(
        params.solicitacao_id, 
        params.participante_id
      );
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          { message: 'Nenhum evento encontrado para este participante nesta solicitação' }, 
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        { error: 'Erro ao buscar eventos' }, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('eventos/solicitacao/:solicitacao_id/diarias')
  async getDiariasSolicitacao(@Param() params: SolicitacaoIdDto): Promise<DiariasResponseDto[]> {
    try {
      return await this.solicitacaoService.getDiariasBySolicitacao(params.solicitacao_id);
    } catch (error) {
      if (error.status === HttpStatus.NOT_FOUND) {
        throw new HttpException(
          { message: 'Nenhum evento ou participante encontrado para esta solicitação' }, 
          HttpStatus.NOT_FOUND
        );
      }
      throw new HttpException(
        { error: 'Erro ao calcular diárias para esta solicitação' }, 
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }


  @Get('participantes/viagem/solicitacao/:id')
  findVerificaParticipantesComViagemNoResumo(@Param('id') id: string) {
    return this.solicitacaoService.findParticipantesSemViagem(+id);
  }

}
