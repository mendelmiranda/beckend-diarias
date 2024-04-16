import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AprovacaoDefinitivaDaofService } from './aprovacao_definitiva_daof.service';
import { CreateAprovacaoDefinitivaDaofDto } from './dto/create-aprovacao_definitiva_daof.dto';
import { UpdateAprovacaoDefinitivaDaofDto } from './dto/update-aprovacao_definitiva_daof.dto';

@Controller('aprovacao-definitiva-daof')
export class AprovacaoDefinitivaDaofController {
  constructor(private readonly aprovacaoDefinitivaDaofService: AprovacaoDefinitivaDaofService) {}

  @Post()
  create(@Body() createAprovacaoDefinitivaDaofDto: CreateAprovacaoDefinitivaDaofDto) {
    return this.aprovacaoDefinitivaDaofService.create(createAprovacaoDefinitivaDaofDto);
  }

  @Get('/assinatura-diretor/solicitacao/:id')
  findAssinatura(@Param('id') id: string) {
    return this.aprovacaoDefinitivaDaofService.findAssinaturaDiretorDAOF(parseInt(id));
  }

  @Get()
  findAll() {
    return this.aprovacaoDefinitivaDaofService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aprovacaoDefinitivaDaofService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAprovacaoDefinitivaDaofDto: UpdateAprovacaoDefinitivaDaofDto) {
    return this.aprovacaoDefinitivaDaofService.update(+id, updateAprovacaoDefinitivaDaofDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aprovacaoDefinitivaDaofService.remove(+id);
  }
}
