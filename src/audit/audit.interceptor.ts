import {
  Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const shouldAudit = Reflect.getMetadata('audit', handler);

    if (shouldAudit && request.user) {
      // Acessa as informações do usuário do objeto de requisição, assumindo que estejam em request.user
      const username = request.user.username; // Supondo que username é uma propriedade do objeto user
      Logger.log(`Usuário ${username} está executando uma ação`);
    }

    return next.handle().pipe(
      tap(() => {
        if (shouldAudit && request.user) {
          // Assume-se que request.user ainda esteja disponível aqui
          const username = request.user;
          // Logar mais detalhes ou resultados da ação após a execução
          Logger.log(`Ação do usuário ${username} concluída`);
        }
      })
    );
  }
}
