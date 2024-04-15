import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AssinaturaDaradService } from './assinatura_darad.service';
import { CreateAssinaturaDaradDto } from './dto/create-assinatura_darad.dto';
import { UpdateAssinaturaDaradDto } from './dto/update-assinatura_darad.dto';

@Controller('assinatura-darad')
export class AssinaturaDaradController {
  constructor(private readonly assinaturaDaradService: AssinaturaDaradService) {}

  @Post()
  create(@Body() createAssinaturaDaradDto: CreateAssinaturaDaradDto) {
    return this.assinaturaDaradService.create(createAssinaturaDaradDto);
  }

  @Get()
  findAll() {
    return this.assinaturaDaradService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.assinaturaDaradService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAssinaturaDaradDto: UpdateAssinaturaDaradDto) {
    return this.assinaturaDaradService.update(+id, updateAssinaturaDaradDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.assinaturaDaradService.remove(+id);
  }
}
