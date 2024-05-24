import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AeroportoService } from './aeroporto.service';
import { CreateAeroportoDto } from './dto/create-aeroporto.dto';
import { UpdateAeroportoDto } from './dto/update-aeroporto.dto';

@Controller('aeroporto')
export class AeroportoController {
  constructor(private readonly aeroportoService: AeroportoService) {}

  @Post()
  create(@Body() createAeroportoDto: CreateAeroportoDto) {
    return this.aeroportoService.create(createAeroportoDto);
  }

  @Get()
  findAll() {
    return this.aeroportoService.findAll();
  }

  @Get('/cidade/nome/:nome')
  findAllByNome(@Param('nome') nome: string) {
    return this.aeroportoService.getAeroportos(nome);
  }

  @Get('/descricao/:desc')
  findOneCidadePais(@Param('desc') desc: string) {
    return this.aeroportoService.findCidadePais(desc.toUpperCase());
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aeroportoService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAeroportoDto: UpdateAeroportoDto) {
    return this.aeroportoService.update(+id, updateAeroportoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aeroportoService.remove(+id);
  }
}
