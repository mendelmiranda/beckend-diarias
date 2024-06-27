import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EventoParticipantesService } from './evento_participantes.service';
import { CreateEventoParticipanteDto } from './dto/create-evento_participante.dto';
import { UpdateEventoParticipanteDto } from './dto/update-evento_participante.dto';

@Controller('evento-participantes')
export class EventoParticipantesController {
  constructor(
    private readonly eventoParticipantesService: EventoParticipantesService,
  ) {}

  @Post()
  create(@Body() createEventoParticipanteDto: CreateEventoParticipanteDto) {
    return this.eventoParticipantesService.create(createEventoParticipanteDto);
  }

  @Get()
  findAll() {
    return this.eventoParticipantesService.findAll();
  }

  @Get('/evento/:id')
  findParticipantesDoEvento(@Param('id') id: number) {
    return this.eventoParticipantesService.findParticipantesDoEvento(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventoParticipantesService.findOne(+id);
  }

  @Get('/participante/cpf/:cpf')
  findParticipantesDoEventoInfo(@Param('cpf') cpf: string) {
    return this.eventoParticipantesService.findParticipanteDoEventoInfo(cpf);
  }

  @Get('/evento/viagem/solicitacao/:id')
  async findParticipantesAgrupadosPorEvento(@Param('id') id: number) {
    const dados = await this.eventoParticipantesService.buscarParticipantesEvento(id);    

    const agrupadosPorOrigemDestinoEvento = dados.reduce((acc, evento) => {
      evento.evento_participantes.forEach(participante => {
          participante.viagem_participantes.forEach(viagem => {
              // Usando operador ternário para escolher entre 'origem'/'destino' e 'cidade_origem'/'cidade_destino'
              const origemCidade = viagem.viagem.origem ? viagem.viagem.origem.cidade : viagem.viagem.cidade_origem.descricao;
              const destinoCidade = viagem.viagem.destino ? viagem.viagem.destino.cidade : viagem.viagem.cidade_destino.descricao;
  
              const chave = `${origemCidade}-${destinoCidade}-${evento.titulo}`;
              
              // Encontrar um grupo existente com a mesma chave
              let grupoExistente = acc.find(g => g.titulo === evento.titulo && 
                                                 g.origem === origemCidade && 
                                                 g.destino === destinoCidade);
  
              if (!grupoExistente) {
                  // Se não existir, crie um novo grupo
                  grupoExistente = {
                      titulo: evento.titulo,
                      origem: origemCidade,
                      destino: destinoCidade,
                      participantes: []
                  };
                  acc.push(grupoExistente);
              }
              
              // Adicionar o participante ao grupo existente
              grupoExistente.participantes.push({
                  nome: participante.participante.nome,
                  id: participante.participante.id
              });
          });
      });
      return acc;
  }, []);
  

        return agrupadosPorOrigemDestinoEvento;
}



  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventoParticipanteDto: UpdateEventoParticipanteDto,
  ) {
    return this.eventoParticipantesService.update(
      +id,
      updateEventoParticipanteDto,
    );
  }

  /* @Delete('/evento/:idEvento/participante/:idParticipante')
  remove(@Param('idEvento') idEvento: number, @Param('idParticipante') idParticipante: number) {
    return this.eventoParticipantesService.remove(+idEvento, +idParticipante);
  } */

  @Delete('/evento/:id')
  remove(@Param('id') id: number) {
    return this.eventoParticipantesService.remove(+id);
  }
}
