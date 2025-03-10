import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppLogger } from './app.logger';
import { Request, Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  private readonly appLogger = new AppLogger();

  catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const req = context.getRequest<Request>();
    const res = context.getResponse<Response>();
    const status = exception.getStatus();

    const params: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (Object.keys(req.body).length > 0) {
      params.push(`[REQUEST_BODY]=${JSON.stringify(req.body)}`);
    }

    if (Object.keys(req.query).length > 0) {
      params.push(`[REQUEST_QUERY]=${JSON.stringify(req.query)}`);
    }

    if (Object.keys(req.params).length > 0) {
      params.push(`[REQUEST_PARAMS]=${JSON.stringify(req.params)}`);
    }

    this.appLogger.error(exception.message, req.url, ...params);

    res.status(status).json({
      statusCode: status,
      message: 'Something went wrong',
      error: 'Internal Server Error',
    });
  }
}
