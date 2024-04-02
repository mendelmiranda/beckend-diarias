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
      // Aqui você pode tratar diferentes códigos de erro do Prisma e personalizar a resposta
      status = HttpStatus.BAD_REQUEST;
      message = 'Erro de banco de dados.';
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse()+"";
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
