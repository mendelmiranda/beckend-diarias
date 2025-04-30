import { Controller, Get, Post, Body, Patch, Param, Delete, Put, NotFoundException } from '@nestjs/common';
import { AssinaturaService } from './assinatura.service';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';

@Controller('assinatura')
export class AssinaturaController {
  constructor(private readonly assinaturaService: AssinaturaService) {}

  @Post()
  create(@Body() createAssinaturaDto: CreateAssinaturaDto) {
    return this.assinaturaService.create(createAssinaturaDto);
  }

  @Get()
  findAll() {
    return this.assinaturaService.findAll();
  }

  @Get('/ativa')
  findAssinaturaAtiva() {
    return this.assinaturaService.findAssinaturaAtiva();
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assinaturaService.findOne(+id);
  }

  @Get('/nome/:nome')
async findAssinaturaByNome(@Param('nome') nome: string) {
  const assinatura = await this.assinaturaService.findAssinaturaByNome(nome);
  
  if (!assinatura) {
    throw new NotFoundException(`Assinatura com nome ${nome} não encontrada`);
  }
  
  return assinatura;
}

  @Put(':id')
  update(@Param('id') id: string, @Body() updateAssinaturaDto: UpdateAssinaturaDto) {
    return this.assinaturaService.update(+id, updateAssinaturaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assinaturaService.remove(+id);
  }
}
