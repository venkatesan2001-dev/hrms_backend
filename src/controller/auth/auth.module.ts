import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { EmployeeService } from '../employee/employee.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from '../employee/schema/employee.schema';
import { MailConfigService } from '../../utils/mail.config';
import { EmailTemplateService } from '../email_template/email_template.service';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from '../email_template/schema/email_template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
  ],
  providers: [
    AuthService,
    EmployeeService,
    MailConfigService,
    EmailTemplateService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
