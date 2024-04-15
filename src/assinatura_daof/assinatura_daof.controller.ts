import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssinaturaDaofService } from './assinatura_daof.service';
import { CreateAssinaturaDaofDto } from './dto/create-assinatura_daof.dto';
import { UpdateAssinaturaDaofDto } from './dto/update-assinatura_daof.dto';

@Controller('assinatura-daof')
export class AssinaturaDaofController {
  constructor(private readonly assinaturaDaofService: AssinaturaDaofService) {}

  @Post()
  create(@Body() createAssinaturaDaofDto: CreateAssinaturaDaofDto) {
    return this.assinaturaDaofService.create(createAssinaturaDaofDto);
  }

  @Get()
  findAll() {
    return this.assinaturaDaofService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assinaturaDaofService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssinaturaDaofDto: UpdateAssinaturaDaofDto) {
    return this.assinaturaDaofService.update(+id, updateAssinaturaDaofDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assinaturaDaofService.remove(+id);
  }
}
