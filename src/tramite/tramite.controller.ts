import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';
import { TramiteService } from './tramite.service';

@Controller('tramite')
export class TramiteController {
  constructor(private readonly tramiteService: TramiteService) {}

  @Post(':id')
  async create(
    @Param('id') id: string,
    @Body() createTramiteDto: CreateTramiteDto,
  ) {
    
    const data: CreateTramiteDto = {
      ...createTramiteDto,
      datareg: new Date(),
    };

    if (+id > 0) {    
      await this.tramiteService.updateStatus(+id, createTramiteDto.status);
    }     
    await this.tramiteService.create(createTramiteDto);

    return 0;
  }

  @Get()
  findAll() {
    return this.tramiteService.findAll();
  }

  @Get('/lotacao/:id')
  findTramitePorLocatacao(@Param('id') id: string) {
    return this.tramiteService.findTramitePorLotacao(+id);
  }

  @Get('/presidencia/todos')
  findTramitePresidencia() {
    return this.tramiteService.findTramitePresidencia();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tramiteService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTramiteDto: UpdateTramiteDto) {
    return this.tramiteService.update(+id, updateTramiteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tramiteService.remove(+id);
  }

  @Put('/status/:id')
  updateStatus(@Param('id') id: string) {
    return this.tramiteService.updateStatus(+id, 'RECUSADO');
  }
}
