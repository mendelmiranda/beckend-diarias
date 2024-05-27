import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, CacheInterceptor, CacheTTL } from '@nestjs/common';
import { CidadeService } from './cidade.service';
import { CreateCidadeDto } from './dto/create-cidade.dto';
import { UpdateCidadeDto } from './dto/update-cidade.dto';

@Controller('cidade')
export class CidadeController {
  constructor(private readonly cidadeService: CidadeService) {}

  @Post()
  create(@Body() createCidadeDto: CreateCidadeDto) {
    return this.cidadeService.create(createCidadeDto);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  findAll() {
    return this.cidadeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cidadeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCidadeDto: UpdateCidadeDto) {
    return this.cidadeService.update(+id, updateCidadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cidadeService.remove(+id);
  }


  @Get('/estado/:id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  cidadesDoEstado(@Param('id') id: string) {
    return this.cidadeService.localizaCidadesPorEstadoId(+id);
  }

}
