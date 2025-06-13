// tipo-evento.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { TipoEventoService } from './tipo_evento.service';
import { UpdateTipoEventoDto } from './dto/update-tipo_evento.dto';
import { CreateTipoEventoDto } from './dto/create-tipo_evento.dto';


@Controller('tipo-evento')
export class TipoEventoController {
  constructor(private readonly tipoEventoService: TipoEventoService) {}

  @Get()
  async findAll() {
    try {
      return await this.tipoEventoService.findAll();
    } catch (error) {
      throw new HttpException('Erro ao buscar tipos de evento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const tipoEvento = await this.tipoEventoService.findOne(id);
      if (!tipoEvento) {
        throw new HttpException('Tipo de evento não encontrado', HttpStatus.NOT_FOUND);
      }
      return tipoEvento;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao buscar tipo de evento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post()
  async create(@Body() createTipoEventoDto: CreateTipoEventoDto) {
    try {
      return await this.tipoEventoService.create(createTipoEventoDto);
    } catch (error) {
      throw new HttpException('Erro ao criar tipo de evento', HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateTipoEventoDto: UpdateTipoEventoDto) {
    try {
      const tipoEvento = await this.tipoEventoService.update(id, updateTipoEventoDto);
      if (!tipoEvento) {
        throw new HttpException('Tipo de evento não encontrado', HttpStatus.NOT_FOUND);
      }
      return tipoEvento;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao atualizar tipo de evento', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const result = await this.tipoEventoService.remove(id);
      if (!result) {
        throw new HttpException('Tipo de evento não encontrado', HttpStatus.NOT_FOUND);
      }
      return { message: 'Tipo de evento deletado com sucesso' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Erro ao deletar tipo de evento', HttpStatus.BAD_REQUEST);
    }
  }
}