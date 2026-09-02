import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch(PrismaClientKnownRequestError, HttpException, Error)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: PrismaClientKnownRequestError | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro inesperado.';

    const prismaCode = (exception as PrismaClientKnownRequestError).code;
    const prismaMeta = (exception as PrismaClientKnownRequestError).meta;
    const rawMessage = exception instanceof Error ? exception.message : String(exception);

    if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = rawMessage || 'Erro de banco de dados.';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = extrairMensagemHttp(exception);
    } else if (exception instanceof Error && exception.message) {
      message = exception.message;
    }

    this.logger.error({
      statusCode: status,
      message,
      code: prismaCode,
      meta: prismaMeta,
    });
    console.error('[PrismaExceptionFilter]', {
      statusCode: status,
      message: rawMessage,
      code: prismaCode,
      meta: prismaMeta,
    });
    if (exception instanceof Error && exception.stack) {
      console.error(exception.stack);
    }

    response.status(status).json({
      statusCode: status,
      message,
      code: prismaCode,
      meta: prismaMeta,
    });
  }
}

function extrairMensagemHttp(exception: HttpException): string {
  const corpo = exception.getResponse();
  if (typeof corpo === 'string' && corpo.trim() && corpo !== '[object Object]') {
    return corpo;
  }
  if (corpo && typeof corpo === 'object') {
    const o = corpo as Record<string, unknown>;
    if (typeof o.message === 'string' && o.message.trim() && o.message !== '[object Object]') {
      return o.message;
    }
    if (Array.isArray(o.message)) {
      const partes = o.message.filter((m): m is string => typeof m === 'string' && m.trim().length > 0);
      if (partes.length > 0) return partes.join(' ');
    }
  }
  return exception.message || 'Ocorreu um erro inesperado.';
}
