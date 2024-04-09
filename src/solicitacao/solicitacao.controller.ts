import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Request,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { SolicitacaoService } from './solicitacao.service';
import { CreateSolicitacaoDto } from './dto/create-solicitacao.dto';
import { UpdateSolicitacaoDto } from './dto/update-solicitacao.dto';
import PesquisaSolicitacaoDTO from './dto/pesquisa-solicitacao.dto';
import { InfoUsuario } from 'src/log_sistema/log_sistema.service';
import { ConsultaSetoresDto } from './dto/consulta-setores.dto';

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

  @Get('/detalhes/:id')
  detalhes(@Param('id') id: string) {
    return this.solicitacaoService.detalhesDaSolicitacao(+id);
  }

  @Get('/responsaveis')
  listarResponsaveisDaSolicitacao() {
    return this.solicitacaoService.pesquisarResponsaveis();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitacaoService.findOne(+id);
  }

  @Put(':id')
  update( @Param('id') id: string, @Body() updateSolicitacaoDto: UpdateSolicitacaoDto, 
  @Req() request: Request ) {
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
    return this.solicitacaoService.pesquisarSolicitacoes(dto);
  }
}
