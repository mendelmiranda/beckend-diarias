import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { participante } from '@prisma/client';
import { Util } from 'src/util/Util';
import moment from 'moment';
import { ContaDiariaService } from '../conta_diaria/conta_diaria.service';
import { CreateContaDiariaDto } from '../conta_diaria/dto/create-conta_diaria.dto';
import { EventoParticipante } from '../evento_participantes/entities/evento_participante.entity';
import { EventoParticipantesService } from '../evento_participantes/evento_participantes.service';
import { CreateEventoParticipanteDto } from '../evento_participantes/dto/create-evento_participante.dto';
import { UpdateContaDiariaDto } from 'src/conta_diaria/dto/update-conta_diaria.dto';

@Controller('participante')
export class ParticipanteController {
  constructor(
    private readonly participanteService: ParticipanteService,
    private readonly contaDiariaService: ContaDiariaService,
    private readonly eventoParticipanteService: EventoParticipantesService,
  ) {}

  @Post('/evento/:id')
  async create(@Param('id') idEvento: number, @Body() createParticipanteDto: CreateParticipanteDto) {        

    const dateString = createParticipanteDto.data_nascimento as any;
        
    let resultado;

    if (createParticipanteDto.tipo !== 'S') {
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
        };
        this.contaDiariaService.create(conta);
      }

      const prop = 'contaDiariaModel';
      delete createParticipanteDto[prop];

      const data: CreateParticipanteDto = {
        ...createParticipanteDto,
        data_nascimento: Util.convertToDate(dateString),
      };
      
      resultado = (await this.participanteService.create(data)).id;

      const eventoPaticipanteDto: CreateEventoParticipanteDto = {
        evento_id: parseInt(idEvento+''),
        participante_id: resultado,
      }

      this.eventoParticipanteService.create(eventoPaticipanteDto);

    } else {
      const data: CreateParticipanteDto = {
        ...createParticipanteDto,
        data_nascimento: new Date(dateString),
      };
      resultado = await (await this.participanteService.create(data)).id;

      const eventoPaticipanteDto: CreateEventoParticipanteDto = {
        evento_id: parseInt(idEvento+''),
        participante_id: resultado,
      }

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

  /* @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participanteService.findOne(+id);
  } */

  @Put(':id/evento/:idEvento')
  async update(
    @Param('id') id: number, @Param('idEvento') idEvento: number,
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
      
      resultado = (await this.participanteService.update(+id, data)).id;

            
      const eventoPaticipanteDto: CreateEventoParticipanteDto = {
        evento_id: parseInt(idEvento+''),
        participante_id: resultado,
      }

      await this.eventoParticipanteService.create(eventoPaticipanteDto);
    }

    return resultado;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participanteService.remove(+id);
  }
}
