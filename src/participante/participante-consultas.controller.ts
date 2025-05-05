import { Controller, Get } from "@nestjs/common";
import { ParticipanteService } from "./participante.service";



@Controller('participante-consultas')
export class ParticipanteConsultasController {

    constructor(
        private readonly participanteService: ParticipanteService){}

    
        @Get('/em-eventos')
        consultarParticipantesEmViagem() {
            return this.participanteService.findParticipantesEmEventosAtuais();
        }

}