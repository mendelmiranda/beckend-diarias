import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { CargoDiariasService } from './cargo_diarias.service';
import { CreateCargoDiariaDto } from './dto/create-cargo_diaria.dto';
import { UpdateCargoDiariaDto } from './dto/update-cargo_diaria.dto';

@Controller('cargo-diarias')
export class CargoDiariasController {
  constructor(private readonly cargoDiariasService: CargoDiariasService) {}

  @Post()
  create(@Body() createCargoDiariaDto: CreateCargoDiariaDto, @Req() request: Request) {
    const usuario = JSON.parse(request.headers['dados_client']);
    
    return this.cargoDiariasService.create(createCargoDiariaDto, usuario);
  }

  @Get()
  findAll() {
    return this.cargoDiariasService.findAll();
  }

  @Get('/cargo/:cargo')
  findDiariaPorCargo(@Param('cargo') cargo: string) {
    return this.cargoDiariasService.findDiariasPorCargo(cargo);
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
  remove(@Param('id') id: string, @Req() request: Request) {
    const usuario = JSON.parse(request.headers['dados_client']);

    return this.cargoDiariasService.remove(+id, usuario);
  }
}
