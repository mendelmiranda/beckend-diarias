import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CondutoresService } from './condutores.service';
import { CreateCondutoreDto } from './dto/create-condutore.dto';
import { UpdateCondutoreDto } from './dto/update-condutore.dto';

@Controller('condutores')
export class CondutoresController {
  constructor(private readonly condutoresService: CondutoresService) {}

  @Post()
  create(@Body() createCondutoreDto: CreateCondutoreDto) {
    return this.condutoresService.create(createCondutoreDto);
  }

  @Get()
  findAll() {
    return this.condutoresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {    
    return this.condutoresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCondutoreDto: UpdateCondutoreDto) {
    return this.condutoresService.update(+id, updateCondutoreDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const resultado = await this.condutoresService.remove(+id);    
    return resultado;
  }
  
}
