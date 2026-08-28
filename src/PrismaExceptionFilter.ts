import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Catch(PrismaClientKnownRequestError, HttpException, Error)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: PrismaClientKnownRequestError | HttpException | Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro inesperado.';

    if (exception instanceof PrismaClientKnownRequestError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Erro de banco de dados.';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = extrairMensagemHttp(exception);
    } else if (exception instanceof Error && exception.message) {
      message = exception.message;
    }

    response.status(status).json({
      statusCode: status,
      message,
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
