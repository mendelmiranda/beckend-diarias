import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogSistemaService } from './log_sistema.service';
import { CreateLogSistemaDto } from './dto/create-log_sistema.dto';
import { UpdateLogSistemaDto } from './dto/update-log_sistema.dto';

@Controller('log-sistema')
export class LogSistemaController {
  constructor(private readonly logSistemaService: LogSistemaService) {}

  @Post()
  create(@Body() createLogSistemaDto: CreateLogSistemaDto) {
    return this.logSistemaService.create(createLogSistemaDto);
  }

  @Get()
  findAll() {
    return this.logSistemaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.logSistemaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogSistemaDto: UpdateLogSistemaDto) {
    return this.logSistemaService.update(+id, updateLogSistemaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.logSistemaService.remove(+id);
  }
}
