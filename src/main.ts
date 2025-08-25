import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import {
  BadRequestExceptionFilter,
  HttpExceptionFilter,
} from './utils/exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(WINSTON_MODULE_PROVIDER);
  app.useLogger(logger);
  app.useGlobalFilters(new BadRequestExceptionFilter(logger));
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validateCustomDecorators: true,
      stopAtFirstError: true,
    }),
  );
  app.enableCors();
  await app.listen(configService.get('PORT'));
}
bootstrap();
