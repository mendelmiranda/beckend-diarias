import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, CacheInterceptor, CacheTTL } from '@nestjs/common';
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
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  findAll() {
    return this.aeroportoService.findAll();
  }

  @Get('/cidade/nome/:nome')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  findAllByNome(@Param('nome') nome: string) {
    return this.aeroportoService.getAeroportos(nome);
  }

  @Get('/pesquisar/pais/nome/:nome')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  findAllPaisesByNome(@Param('nome') nome: string) {
    return this.aeroportoService.searchAeroportoEPais(nome);
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
