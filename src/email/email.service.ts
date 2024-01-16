
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  
  public enviarEmail(numero: number, status: string, to: string, mensagem?: string): void {
    this
      .mailerService
      .sendMail({
        to: to+'@tce.ap.gov.br', // list of receivers
        from: 'contato@tce.ap.gov.br', // sender address
        subject: 'SOLICITAÇÃO DE PASSAGENS E DIÁRIAS',
        template: '../template/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: numero,
          username: status,
          mensagem: mensagem,
        },
      })
       .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }
  
  
}