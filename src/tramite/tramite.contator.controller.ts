import {
    Controller,
    Get
} from '@nestjs/common';
import { TramiteService } from './tramite.service';
  
  @Controller('tramite-contador')
  export class TramiteContadorController {
    constructor(private readonly tramiteService: TramiteService) { }
  
    
  
    @Get('/aguardando-calculo')
    pesquisaServidor() {
      return this.tramiteService.listarAguardandoCalculo();
    }
  }
  