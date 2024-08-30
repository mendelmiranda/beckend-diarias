import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmpenhoDaofiService } from './empenho_daofi.service';
import { CreateEmpenhoDaofiDto } from './dto/create-empenho_daofi.dto';
import { UpdateEmpenhoDaofiDto } from './dto/update-empenho_daofi.dto';

@Controller('empenho-daofi')
export class EmpenhoDaofiController {
  constructor(private readonly empenhoDaofiService: EmpenhoDaofiService) {}

  @Post()
  create(@Body() createEmpenhoDaofiDto: CreateEmpenhoDaofiDto) {
    return this.empenhoDaofiService.create(createEmpenhoDaofiDto);
  }

  @Get()
  findAll() {
    return this.empenhoDaofiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.empenhoDaofiService.findOne(+id);
  }

  @Get('/solicitacao/:id')
  findEmpenhoPorSolicitacao(@Param('id') id: string) {
    return this.empenhoDaofiService.findEmpenhoPorSolicitacaoId(+id);
  }

  @Get('/valores/solicitacao/:id')
  findInfoValoresPorSolicitacao(@Param('id') id: string) {
    return this.empenhoDaofiService.findInfoValoresParaEmpenhoPorSolicitacaoId(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmpenhoDaofiDto: UpdateEmpenhoDaofiDto) {
    return this.empenhoDaofiService.update(+id, updateEmpenhoDaofiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.empenhoDaofiService.remove(+id);
  }
}
