import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import DailyRotateFile = require('winston-daily-rotate-file');
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { EmployeeModule } from './controller/employee/employee.module';
import { AuthModule } from './controller/auth/auth.module';
import { EmailTemplateModule } from './controller/email_template/email_template.module';

@Module({
  imports: [
    AuthModule,
    EmployeeModule,
    EmailTemplateModule,
    JwtModule.register({
      global: true,
    }),
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        // uri: configService.get('MONGO_URI'),
        uri: 'mongodb+srv://venkatesan2001official:venkatesan2001official@cluster0.we3z6ih.mongodb.net/',
      }),
      inject: [ConfigService],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json(),
        ),
        transports: [
          new DailyRotateFile({
            filename: '%DATE%',
            dirname: configService.get('WINSTON_LOG_PATH'),
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            json: true,
            extension: '.log',
          }),
          new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            format: winston.format.combine(
              winston.format.timestamp(),
              nestWinstonModuleUtilities.format.nestLike('analytics_service', {
                colors: true,
              }),
            ),
          }),
        ],
        exitOnError: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
