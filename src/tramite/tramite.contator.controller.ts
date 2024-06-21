import {
    Controller,
    Get,
    Param
} from '@nestjs/common';
import { TramiteService } from './tramite.service';
  
  @Controller('tramite-contador')
  export class TramiteContadorController {
    constructor(private readonly tramiteService: TramiteService) { }
  
    
  
    @Get('/contador/status/:status/destino/:destino')
    aguardandoCalculoContador(@Param('status') status: string, @Param('destino') cod_lotacao_destino: number) {
      return this.tramiteService.listarContador(status, cod_lotacao_destino);
    }


    /* @Get('/darad-finalizar')
    daradFinalizarContador() {
      return this.tramiteService.listarFinalizarDaradContador();
    }

    @Get('/darad-gerar-pdf')
    daradGerarPDFContador() {
      return this.tramiteService.listarGerarPDFDaradContador();
    } */

  }
  