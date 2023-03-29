import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValorViagemService } from './valor_viagem.service';
import { CreateValorViagemDto } from './dto/create-valor_viagem.dto';
import { UpdateValorViagemDto } from './dto/update-valor_viagem.dto';

@Controller('valor-viagem')
export class ValorViagemController {
  constructor(private readonly valorViagemService: ValorViagemService) {}

  @Post()
  create(@Body() createValorViagemDto: CreateValorViagemDto) {
    return this.valorViagemService.create(createValorViagemDto);
  }

  @Get()
  findAll() {
    return this.valorViagemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valorViagemService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValorViagemDto: UpdateValorViagemDto) {
    return this.valorViagemService.update(+id, updateValorViagemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valorViagemService.remove(+id);
  }
}
