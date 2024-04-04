import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrganogramaService } from './organograma.service';
import { CreateOrganogramaDto } from './dto/create-organograma.dto';
import { UpdateOrganogramaDto } from './dto/update-organograma.dto';

@Controller('organograma')
export class OrganogramaController {
  constructor(private readonly organogramaService: OrganogramaService) {}

  @Post()
  create(@Body() createOrganogramaDto: CreateOrganogramaDto) {
    return this.organogramaService.create(createOrganogramaDto);
  }

  @Get()
  findAll() {
    return this.organogramaService.findAll().catch((error) => {
      console.log('error', error);
      
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organogramaService.findOne(+id);
  }

  @Get('/setor/nome/:nome')
  findOneByNome(@Param('nome') nome: string) {
    console.log(nome);
    
    return this.organogramaService.findOneByNome(nome);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrganogramaDto: UpdateOrganogramaDto) {
    return this.organogramaService.update(+id, updateOrganogramaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.organogramaService.remove(+id);
  }
}
