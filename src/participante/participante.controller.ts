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
import { conta_diaria } from '@prisma/client';
import { AnexoSolicitacaoService } from 'src/anexo_solicitacao/anexo_solicitacao.service';
import { UpdateContaDiariaDto } from 'src/conta_diaria/dto/update-conta_diaria.dto';
import { Util } from 'src/util/Util';
import { ContaDiariaService } from '../conta_diaria/conta_diaria.service';
import { CreateContaDiariaDto } from '../conta_diaria/dto/create-conta_diaria.dto';
import { CreateEventoParticipanteDto } from '../evento_participantes/dto/create-evento_participante.dto';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { ParticipanteService } from './participante.service';

@Controller('participante')
export class ParticipanteController {
  constructor(
    private readonly participanteService: ParticipanteService,
    private readonly contaDiariaService: ContaDiariaService,
    private readonly eventoParticipanteService: EventoParticipantesService,
    private readonly anexoSolicitacao: AnexoSolicitacaoService,
  ) { }

  @Post('/evento/:id')
  async create(
    @Param('id') idEvento: number,
    @Body() createParticipanteDto: CreateParticipanteDto,
  ) {

    const dateString = createParticipanteDto.data_nascimento as any;

    let resultado;

    if (createParticipanteDto.tipo !== 'S') {

      try {

        const contaDto = createParticipanteDto.contaDiariaModel;

        if (contaDto !== undefined) {
          const conta: CreateContaDiariaDto = {
            nome: contaDto.nome,
            cpf: contaDto.cpf,
            tipo: contaDto.tipo,
            tipo_conta: contaDto.tipo_conta,
            agencia: contaDto.agencia,
            conta: contaDto.conta,
            banco_id: contaDto.banco_id,
            participante_id: contaDto.participante_id,
          };
          this.contaDiariaService.create(conta);
        }

        const prop = 'contaDiariaModel';
        delete createParticipanteDto[prop];

        const data: CreateParticipanteDto = {
          ...createParticipanteDto,
          //data_nascimento: Util.convertToDate(dateString),
        };        

        resultado = (await this.participanteService.create(data));        

        const eventoPaticipanteDto: CreateEventoParticipanteDto = {
          evento_id: parseInt(idEvento + ''),
          participante_id: resultado,
        };

        this.eventoParticipanteService.create(eventoPaticipanteDto);

      } catch (e) {
        console.log('erro', e);
      }

    } else {

      const data: CreateParticipanteDto = {
        ...createParticipanteDto,
        data_nascimento: new Date(dateString),
      };

      const result = await this.participanteService.create(data);
      const id = typeof result === 'number' ? result : result.id;

      const eventoPaticipanteDto: CreateEventoParticipanteDto = {
        evento_id: parseInt(idEvento + ''),
        participante_id: parseInt(id + ''),
      };

      this.eventoParticipanteService.create(eventoPaticipanteDto);
    }
    return resultado;
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
    let resultado;

    if (updateParticipanteDto.tipo !== 'S' && id > 0) {
      const contaDto = updateParticipanteDto.contaDiariaModel;

      if (contaDto !== undefined) {
        const conta: UpdateContaDiariaDto = {
          id: contaDto.id,
          nome: contaDto.nome,
          cpf: contaDto.cpf,
          tipo: contaDto.tipo,
          tipo_conta: contaDto.tipo_conta,
          agencia: contaDto.agencia,
          conta: contaDto.conta,
          banco_id: contaDto.banco_id,
          participante_id: contaDto.participante_id,
        };

        if (contaDto.id > 0 || contaDto.id === undefined) {
          await this.contaDiariaService.create(conta);
        } else {
          await this.contaDiariaService.update(contaDto.id, conta);
        }
      } /**/

      const prop = 'contaDiariaModel';
      delete updateParticipanteDto[prop];

      const data: UpdateParticipanteDto = {
        ...updateParticipanteDto,
        data_nascimento: Util.convertToDate(dateString),
      };

      //REFATORAR ESSE CÓDIGO - UPDATE
      if (updateParticipanteDto.tipo === 'C' || updateParticipanteDto.tipo === 'T' && id > 0) {
        const remove = 'conta_diaria';
        delete data[remove];
        await this.participanteService.update(+id, data);

        const prop = 'conta_diaria';
        const contaX: conta_diaria = updateParticipanteDto[prop][0];

        const modeloConta: UpdateContaDiariaDto = {
          ...contaX,
          participante_id: id,
        };

        const del = 'id';
        delete modeloConta[del];
        delete modeloConta['participante_id'];

        const idConta = contaX.id;

        if (idConta > 0 && idConta !== undefined) {
          await this.contaDiariaService.update(contaX.id, modeloConta);
        } else {
          await this.contaDiariaService.create(contaX);
        }
      }

      resultado = (await this.participanteService.update(+id, data)).id;

      const eventoPaticipanteDto: CreateEventoParticipanteDto = {
        evento_id: parseInt(idEvento + ''),
        participante_id: resultado,
      };

      await this.eventoParticipanteService.create(eventoPaticipanteDto);
    }

    return resultado;
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

}