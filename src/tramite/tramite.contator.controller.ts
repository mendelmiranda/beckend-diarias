import {
    Controller,
    Get
} from '@nestjs/common';
import { TramiteService } from './tramite.service';
  
  @Controller('tramite-contador')
  export class TramiteContadorController {
    constructor(private readonly tramiteService: TramiteService) { }
  
    
  
    @Get('/aguardando-calculo')
    aguardandoCalculoContador() {
      return this.tramiteService.listarAguardandoCalculo();
    }


    @Get('/darad-finalizar')
    daradFinalizarContador() {
      return this.tramiteService.listarFinalizarDaradContador();
    }

    @Get('/darad-gerar-pdf')
    daradGerarPDFContador() {
      return this.tramiteService.listarGerarPDFDaradContador();
    }

  }
  