import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { QueryFailedError } from 'typeorm';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception;
    if (process.env.NODE_ENV == 'dev') {
      console.log(exception);
    }
    response.status(status).json({
      path: request.url,
      success: false,
      message: exceptionResponse.getResponse(),
      error: process.env.NODE_ENV == 'dev' ? exception : '비공개',
    });
  }
}

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    console.error(exception.driverError);

    response.status(500).json({
      statusCode: 500,
      message: '알수없는 에러가 발생했습니다.',
    });
  }
}

import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const status = 500;
    console.error(exception.driverError);

    response.status(status).json({
      statusCode: status,
      message: '알수없는 에러가 발생했습니다.',
    });
  }
}
