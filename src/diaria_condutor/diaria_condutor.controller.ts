import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { DiariaCondutorService } from './diaria_condutor.service';
import { CreateDiariaCondutorDto } from './dto/create-diaria_condutor.dto';
import { UpdateDiariaCondutorDto } from './dto/update-diaria_condutor.dto';

@Controller('diaria-condutor')
export class DiariaCondutorController {
  constructor(private readonly diariaCondutorService: DiariaCondutorService) {}

  @Post()
  create(@Body() createDiariaCondutorDto: CreateDiariaCondutorDto) {
    return this.diariaCondutorService.create(createDiariaCondutorDto);
  }

  @Get()
  findAll() {
    return this.diariaCondutorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diariaCondutorService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDiariaCondutorDto: UpdateDiariaCondutorDto) {
    return this.diariaCondutorService.update(+id, updateDiariaCondutorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diariaCondutorService.remove(+id);
  }

  @Get('/diaria/condutor/:id')
  findDiariaDoCondutor(@Param('id') id: number) {
    return this.diariaCondutorService.findDiariaDoCondutor(+id);
  }

}
