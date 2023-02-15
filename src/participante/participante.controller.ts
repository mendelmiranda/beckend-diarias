import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { participante } from '@prisma/client';
import { Util } from 'src/util/Util';
import moment from 'moment';


@Controller('participante')
export class ParticipanteController {
  constructor(private readonly participanteService: ParticipanteService) {}

  @Post()
  create(@Body() createParticipanteDto: CreateParticipanteDto) {
    const dateString = createParticipanteDto.data_nascimento as any;

    const data: CreateParticipanteDto = {
      ...createParticipanteDto,
      data_nascimento: Util.convertToDate(dateString)
    }
    
    return this.participanteService.create(data);
  }

  @Get()
  findAll() {
    return this.participanteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participanteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParticipanteDto: UpdateParticipanteDto) {
    return this.participanteService.update(+id, updateParticipanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participanteService.remove(+id);
  }
}

