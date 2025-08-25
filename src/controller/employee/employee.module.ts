import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Employee, EmployeeSchema } from './schema/employee.schema';
import { MailConfigService } from '../../utils/mail.config';
import { AuthService } from '../auth/auth.service';
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
  controllers: [EmployeeController],
  providers: [
    EmployeeService,
    MailConfigService,
    AuthService,
    EmailTemplateService,
  ],
})
export class EmployeeModule {}
