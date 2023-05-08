import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ValorDiariasService } from './valor_diarias.service';
import { CreateValorDiariaDto } from './dto/create-valor_diaria.dto';
import { UpdateValorDiariaDto } from './dto/update-valor_diaria.dto';
import { HttpService } from '@nestjs/axios';

@Controller('valor-diarias')
export class ValorDiariasController {
  constructor(private readonly valorDiariasService: ValorDiariasService) {}

  @Post()
  create(@Body() createValorDiariaDto: CreateValorDiariaDto) {
    return this.valorDiariasService.create(createValorDiariaDto);
  }

  @Get()
  findAll() {
    return this.valorDiariasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.valorDiariasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateValorDiariaDto: UpdateValorDiariaDto) {
    return this.valorDiariasService.update(+id, updateValorDiariaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {   
    return this.valorDiariasService.remove(+id);
  }



  @Get('/cotacao/dolar')
  cotacaoDolar(){
    return this.valorDiariasService.consultarCotacao();
  }


}
