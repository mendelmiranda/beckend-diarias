import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
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

  @Get('/viagem/:id')
  findValorViagem(@Param('id') id: string) {
    return this.valorViagemService.findValorDaViagem(+id);
  }

  @Get('/diaria/colaborador/:id')
  findValorViagemDiariaColaborador(@Param('id') id: string) {
    return this.valorViagemService.findValorDaDiariaColaborador(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valorViagemService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateValorViagemDto: UpdateValorViagemDto) {
    return this.valorViagemService.update(+id, updateValorViagemDto);
  }

  @Get('/existe/valor/viagem/:id')
  findOneValor(@Param('id') id: string) {
    return this.valorViagemService.findOneValorDaViagem(+id);
  }

  @Put('/atualizar/valor/:id')
  updateValor(@Param('id') id: string, @Body() updateValorViagemDto: UpdateValorViagemDto) {
    return this.valorViagemService.updateValor(+id, updateValorViagemDto);
  }

  @Put('/atualizar/valor/viagem/:id')
  updateValorViagem(@Param('id') id: string, @Body() updateValorViagemDto: UpdateValorViagemDto) {
    console.log(updateValorViagemDto);
    
    return this.valorViagemService.updateValorViagem(+id, updateValorViagemDto);
  }

  @Put('/cotacao/:id/valor/:valor')
  updateCotacao(@Param('id') id: string, @Param('valor') valor: string) {
    return this.valorViagemService.updateCotacao(+id, valor);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.valorViagemService.remove(+id);
  }
}
