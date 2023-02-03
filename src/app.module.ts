import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BancosModule } from './bancos/bancos.module';
import { PaisModule } from './pais/pais.module';
import { TipoEventoModule } from './tipo_evento/tipo_evento.module';
import { EstadoModule } from './estado/estado.module';
import { CidadeModule } from './cidade/cidade.module';
import { SolicitacaoModule } from './solicitacao/solicitacao.module';
import { ContaDiariaModule } from './conta_diaria/conta_diaria.module';
import { EventoModule } from './evento/evento.module';
import { ParticipanteModule } from './participante/participante.module';
import { ViagemModule } from './viagem/viagem.module';

@Module({
  imports: [
    BancosModule,
    PaisModule,
    TipoEventoModule,
    EstadoModule,
    CidadeModule,
    SolicitacaoModule,
    ContaDiariaModule,
    EventoModule,
    ParticipanteModule,
    ViagemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
