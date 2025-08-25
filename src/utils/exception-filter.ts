import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ResponseStatus } from 'src/constants';
import { Logger } from 'winston';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const get_res: any = exception.getResponse();

    let response_data = get_res;

    if (typeof get_res.message == 'object') {
      let message = 'Invalid Payload';
      let title = 'Validation Error';
      let data = get_res.message;

      response_data = {
        message: message,
        title: title,
        data: data,
        success: false,
      };

      response_data = JSON.parse(JSON.stringify(response_data));
    }
    this.logger.error(response_data);
    return res.status(ResponseStatus.BAD_REQUEST).json(response_data);
  }
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const get_res: any = exception.getResponse();

    let message = get_res.message
      ? Array.isArray(get_res.message)
        ? get_res.message[0].split('.').length > 1
          ? get_res.message[0].split('.')[1]
          : get_res.message[0]
        : get_res.message
      : get_res.error
        ? get_res.error
        : get_res;

    this.logger.error({
      message,
      success: false,
    });
    return res.status(exception.getStatus()).json({
      message,
      success: false,
    });
  }
}
