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

  @Post('/:id/:nome')
  async create(
    @Param('id') id: string,
    @Param('nome') nome: string,
    @Body() createTramiteDto: CreateTramiteDto,
  ) {
    const data: CreateTramiteDto = {
      ...createTramiteDto,
      datareg: new Date(),
    };

    if (+id > 0) {
      await this.tramiteService.update(+id, createTramiteDto, nome);
    } else {
      await this.tramiteService.create(createTramiteDto, nome);
    }
    return 0;
  }

  @Get()
  findAll() {
    return this.tramiteService.findAll();
  }

  @Get('/solicitacao/:id')
  findTramiteSolicitracao(@Param('id') id: string) {
    return this.tramiteService.findOneSolicitacao(+id);
  }

  @Get('/lotacao/:id')
  findTramitePorLocatacao(@Param('id') id: string) {
    return this.tramiteService.findTramitePorLotacao(+id);
  }

  @Get('/lotacao/:id/origem')
  findTramitePorLocatacaoNaOrigem(@Param('id') id: string) {
    return this.tramiteService.findTramitePorLotacaoAprovadosDaOrigem(+id);
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

  @Put('/status/:id/:nome')
  updateStatus(
    @Param('id') id: string,
    @Param('nome') nome: string,
    @Body() dto: CreateTramiteDto,
  ) {
    return this.tramiteService.updateStatus(+id, 'RECUSADO', nome, dto);
  }
}
