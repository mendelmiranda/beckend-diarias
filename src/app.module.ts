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
import { EventoParticipantesModule } from './evento_participantes/evento_participantes.module';
import { AeroportoModule } from './aeroporto/aeroporto.module';
import { ViagemParticipantesModule } from './viagem_participantes/viagem_participantes.module';
import { TramiteModule } from './tramite/tramite.module';
import { ValorDiariasModule } from './valor_diarias/valor_diarias.module';
import { CargoDiariasModule } from './cargo_diarias/cargo_diarias.module';
import { ValorViagemModule } from './valor_viagem/valor_viagem.module';
import { CorrecaoSolicitacaoModule } from './correcao_solicitacao/correcao_solicitacao.module';
import { LogTramiteModule } from './log_tramite/log_tramite.module';
import { EmpenhoDaofiModule } from './empenho_daofi/empenho_daofi.module';
import { LogSistemaModule } from './log_sistema/log_sistema.module';
import { AnexoSolicitacaoModule } from './anexo_solicitacao/anexo_solicitacao.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailService } from './email/email.service';
import { EventosJuntosModule } from './eventos_juntos/eventos_juntos.module';
import { AprovacaoDefinitivaModule } from './aprovacao_definitiva/aprovacao_definitiva.module';
import { AssinaturaModule } from './assinatura/assinatura.module';
import { CondutoresModule } from './condutores/condutores.module';
import { SolicitacaoCondutoresModule } from './solicitacao_condutores/solicitacao_condutores.module';
import { PrismaExceptionFilter } from './PrismaExceptionFilter';
import { EncaminharSolicitacaoModule } from './encaminhar_solicitacao/encaminhar_solicitacao.module';
import { OrganogramaModule } from './organograma/organograma.module';



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
    EventoParticipantesModule,
    AeroportoModule,
    ViagemParticipantesModule,
    TramiteModule,
    ValorDiariasModule,
    CargoDiariasModule,
    ValorViagemModule,
    CorrecaoSolicitacaoModule,
    LogTramiteModule,
    EmpenhoDaofiModule,
    LogSistemaModule,
    AnexoSolicitacaoModule,

    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.office365.com',
          port: 587,
          secure: false, // upgrade later with STARTTLS
          auth: {
            user: "contato@tce.ap.gov.br",
            pass: "JE%!RE?9g*&fF[$sus>",
          },
        },
        defaults: {
          from:'"nest-modules" <contato@tce.ap.gov.br>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),

    EventosJuntosModule,

    AprovacaoDefinitivaModule,

    AssinaturaModule,

    CondutoresModule,

    SolicitacaoCondutoresModule,

    EncaminharSolicitacaoModule,

    OrganogramaModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, 
  {
    provide: 'APP_FILTER',
    useClass: PrismaExceptionFilter,
  }],
})
export class AppModule {}
