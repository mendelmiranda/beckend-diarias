import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SolicitacaoCondutoresService } from './solicitacao_condutores.service';
import { CreateSolicitacaoCondutoreDto } from './dto/create-solicitacao_condutore.dto';
import { UpdateSolicitacaoCondutoreDto } from './dto/update-solicitacao_condutore.dto';

@Controller('solicitacao-condutores')
export class SolicitacaoCondutoresController {
  constructor(private readonly solicitacaoCondutoresService: SolicitacaoCondutoresService) {}

  @Post()
  create(@Body() createSolicitacaoCondutoreDto: CreateSolicitacaoCondutoreDto) {
    return this.solicitacaoCondutoresService.create(createSolicitacaoCondutoreDto);
  }

  @Get('/solicitacao/:solicitacaoId')
  findAll(@Param('solicitacaoId') id: number) {
    return this.solicitacaoCondutoresService.findAll(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitacaoCondutoresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSolicitacaoCondutoreDto: UpdateSolicitacaoCondutoreDto) {
    return this.solicitacaoCondutoresService.update(+id, updateSolicitacaoCondutoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {    
    return this.solicitacaoCondutoresService.remove(+id);
  }
}
