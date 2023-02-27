import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ContaDiariaService } from './conta_diaria.service';
import { CreateContaDiariaDto } from './dto/create-conta_diaria.dto';
import { UpdateContaDiariaDto } from './dto/update-conta_diaria.dto';

@Controller('conta-diaria')
export class ContaDiariaController {
  constructor(private readonly contaDiariaService: ContaDiariaService) {}

  @Post()
  create(@Body() createContaDiariaDto: CreateContaDiariaDto) {
    return this.contaDiariaService.create(createContaDiariaDto);
  }

  @Get()
  findAll() {
    return this.contaDiariaService.findAll();
  }

  @Get('/participante/cpf/:cpf')
  pesquisaContaDoParticipantePorCpf(@Param('cpf') cpf: string) {
    return this.contaDiariaService.pesquisaContaDoParticipantePorCpf(cpf);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contaDiariaService.findOne(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateContaDiariaDto: UpdateContaDiariaDto,
  ) {
    
    console.log(updateContaDiariaDto.id);
    

    /* if (updateContaDiariaDto.id > 0 || updateContaDiariaDto.id === undefined) {
      const data: CreateContaDiariaDto = {
        nome: updateContaDiariaDto.nome,
        cpf: updateContaDiariaDto.cpf,
        tipo: updateContaDiariaDto.tipo,
        tipo_conta: updateContaDiariaDto.tipo_conta,
        agencia: updateContaDiariaDto.agencia,
        conta: updateContaDiariaDto.conta,
        banco_id: updateContaDiariaDto.banco_id,
      };
      return this.contaDiariaService.create(data);
    } else {
      return this.contaDiariaService.update(+id, updateContaDiariaDto);
    } */
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contaDiariaService.remove(+id);
  }
}
