import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common';
import { CreateValorDiariaDto } from './dto/create-valor_diaria.dto';
import { UpdateValorDiariaDto } from './dto/update-valor_diaria.dto';
import { ValorDiariasService } from './valor_diarias.service';

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

  @Put(':id')
  update(@Param('id') id: string, @Body() updateValorDiariaDto: UpdateValorDiariaDto, @Req() request: Request) {
    
    const usuario = JSON.parse(request.headers['dados_client']);    
    
    return this.valorDiariasService.update(+id, updateValorDiariaDto, usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {   
    return this.valorDiariasService.remove(+id);
  }

  @Get('/cotacao/dolar')
  cotacaoDolar(){
    return this.valorDiariasService.consultarCotacao();
  }

  @Get('/cotacao/bc/dolar')
  cotacaoDolarBancoCentral(){
    return this.valorDiariasService.consultarCotacaoBancoCentral();
  }

  @Get('/cotacao/bc/dolar/data/:dataCotacao')
  cotacaoDolarBancoCentralComData(@Param('dataCotacao') data: string){
    return this.valorDiariasService.consultarCotacaoBancoCentralComData(data);
  }


}
