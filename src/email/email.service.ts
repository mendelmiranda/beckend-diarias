
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  
  public enviarEmail(): void {
    this
      .mailerService
      .sendMail({
        to: 'wendell.sacramento@tce.ap.gov.br', // list of receivers
        from: 'contato@tce.ap.gov.br', // sender address
        subject: 'SOLICITAÇÃO DE PASSAGENS E DIÁRIAS',
        template: '../template/index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: '154',
          username: 'SOLICITADO',
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