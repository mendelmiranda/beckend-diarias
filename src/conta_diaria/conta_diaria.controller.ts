import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContaDiariaService } from './conta_diaria.service';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

@Controller('conta-diaria')
export class ContaDiariaController {
  constructor(private readonly contaDiariaService: ContaDiariaService) {}

  @Post()
  create(@Body() createContaDiariaDto: CreateContaDiariaDto) {
    return this.contaDiariaService.create(createContaDiariaDto);
  }

  @Get()
  findAll() {
    return this.contaDiariaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contaDiariaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContaDiariaDto: UpdateContaDiariaDto) {
    return this.contaDiariaService.update(+id, updateContaDiariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contaDiariaService.remove(+id);
  }
}
