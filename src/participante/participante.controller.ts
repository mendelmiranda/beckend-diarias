import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipanteService } from './participante.service';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { participante } from '@prisma/client';

@Controller('participante')
export class ParticipanteController {
  constructor(private readonly participanteService: ParticipanteService) {}

  @Post()
  create(@Body() createParticipanteDto: CreateParticipanteDto) {

    console.log(JSON.stringify(createParticipanteDto));
    
    return this.participanteService.create(createParticipanteDto);
  }
ok
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
