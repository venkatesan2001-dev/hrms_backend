import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
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
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGO_URI,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
