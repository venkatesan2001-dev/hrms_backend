import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EmployeeModule,
    EmailTemplateModule,
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: process.env.MONGO_URI,
      }),
    }),
    WinstonModule.forRootAsync({
      useFactory: () => {
        const winstonFileEnabled =
          (process.env.WINSTON_FILE_ENABLED || 'true') !== 'false';
        const resolvedDirname =
          process.env.WINSTON_LOG_PATH ||
          (process.env.VERCEL ? '/tmp/logs' : 'logs');

        const transports: winston.transport[] = [
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
        ];

        if (winstonFileEnabled) {
          transports.push(
            new DailyRotateFile({
              filename: '%DATE%',
              dirname: resolvedDirname,
              datePattern: 'YYYY-MM-DD',
              level: 'info',
              json: true,
              extension: '.log',
            }),
          );
        }

        return {
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          transports,
          exitOnError: false,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
