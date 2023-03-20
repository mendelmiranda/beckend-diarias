import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CargoDiariasService } from './cargo_diarias.service';
import { CreateCargoDiariaDto } from './dto/create-cargo_diaria.dto';
import { UpdateCargoDiariaDto } from './dto/update-cargo_diaria.dto';

@Controller('cargo-diarias')
export class CargoDiariasController {
  constructor(private readonly cargoDiariasService: CargoDiariasService) {}

  @Post()
  create(@Body() createCargoDiariaDto: CreateCargoDiariaDto) {
    return this.cargoDiariasService.create(createCargoDiariaDto);
  }

  @Get()
  findAll() {
    return this.cargoDiariasService.findAll();
  }

  @Get('/diaria/:id')
  findCargoDasDiarias(@Param('id') id: string) {
    return this.cargoDiariasService.findCargoDasDiarias(+id);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cargoDiariasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCargoDiariaDto: UpdateCargoDiariaDto) {
    return this.cargoDiariasService.update(+id, updateCargoDiariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cargoDiariasService.remove(+id);
  }
}
