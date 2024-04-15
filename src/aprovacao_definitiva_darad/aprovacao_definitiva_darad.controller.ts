import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AprovacaoDefinitivaDaradService } from './aprovacao_definitiva_darad.service';
import { CreateAprovacaoDefinitivaDaradDto } from './dto/create-aprovacao_definitiva_darad.dto';
import { UpdateAprovacaoDefinitivaDaradDto } from './dto/update-aprovacao_definitiva_darad.dto';

@Controller('aprovacao-definitiva-darad')
export class AprovacaoDefinitivaDaradController {
  constructor(private readonly aprovacaoDefinitivaDaradService: AprovacaoDefinitivaDaradService) {}

  @Post()
  create(@Body() createAprovacaoDefinitivaDaradDto: CreateAprovacaoDefinitivaDaradDto) {
    return this.aprovacaoDefinitivaDaradService.create(createAprovacaoDefinitivaDaradDto);
  }

  @Get()
  findAll() {
    return this.aprovacaoDefinitivaDaradService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aprovacaoDefinitivaDaradService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAprovacaoDefinitivaDaradDto: UpdateAprovacaoDefinitivaDaradDto) {
    return this.aprovacaoDefinitivaDaradService.update(+id, updateAprovacaoDefinitivaDaradDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aprovacaoDefinitivaDaradService.remove(+id);
  }
}
