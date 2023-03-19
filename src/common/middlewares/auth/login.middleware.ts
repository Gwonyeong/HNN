import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception;
    console.log(request.headers);
    return true;
  }
}
