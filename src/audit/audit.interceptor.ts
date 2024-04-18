// src/common/interceptors/audit.interceptor.ts
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
  
      if (shouldAudit) {
        const user = request.user;
        // Registrar a ação do usuário
        Logger.log(`Usuário ${user.username} executou uma ação`);
      }
  
      return next.handle().pipe(
        tap(() => {
          if (shouldAudit) {
            // Logar mais detalhes ou resultados da ação após a execução
            Logger.log(`Ação do usuário ${request.user.username} concluída`);
          }
        })
      );
    }
  }
  