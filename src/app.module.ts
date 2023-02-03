import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BancosModule } from './bancos/bancos.module';
import { PaisModule } from './pais/pais.module';
import { TipoEventoModule } from './tipo_evento/tipo_evento.module';
import { EstadoModule } from './estado/estado.module';
import { CidadeModule } from './cidade/cidade.module';
import { ContasModule } from './contas/contas.module';

@Module({
  imports: [BancosModule, PaisModule, TipoEventoModule, EstadoModule, CidadeModule, ContasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
