import { CreateLogSistemaDto } from "./dto/create-log_sistema.dto";
import { Operacao } from "./log_enum";
import { InfoUsuario, LogSistemaService } from "./log_sistema.service";
import { DateTime } from "luxon";

export class LogSistemaOperacoes {

    constructor(private readonly logSistemaService: LogSistemaService) {}

    create(dto: any, usuario: InfoUsuario){

        const logSistemaDto: CreateLogSistemaDto = {
            datareg: DateTime.now().toJSDate(),
            linha: Object.values(dto) + '',
            usuario:  usuario.nomeCompleto + ' '+ usuario.username,
            operacao: Operacao.INSERT,
          }

          this.logSistemaService.create(logSistemaDto);
    }

    update(dto: any, usuario: InfoUsuario){

        const logSistemaDto: CreateLogSistemaDto = {
            datareg: DateTime.now().toJSDate(),
            linha: Object.values(dto) + '',
            usuario:  usuario.nomeCompleto + ' '+ usuario.username,
            operacao: Operacao.UPDATE,
          }

          this.logSistemaService.create(logSistemaDto);


    }

    delete(dto: any, usuario: InfoUsuario){

        const logSistemaDto: CreateLogSistemaDto = {
            datareg: DateTime.now().toJSDate(),
            linha: Object.values(dto) + '',
            usuario:  usuario.nomeCompleto + ' '+ usuario.username,
            operacao: Operacao.DELETE,
          }

          this.logSistemaService.create(logSistemaDto);
    }

}