import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email_template.service';
import { EmailTemplateController } from './email_template.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailTemplate,
  EmailTemplateSchema,
} from './schema/email_template.schema';
import { AuthService } from '../auth/auth.service';
import { EmployeeService } from '../employee/employee.service';
import { MailConfigService } from '../../utils/mail.config';
import { Employee, EmployeeSchema } from '../employee/schema/employee.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: EmailTemplate.name, schema: EmailTemplateSchema },
    ]),
  ],
  providers: [
    EmailTemplateService,
    AuthService,
    EmployeeService,
    MailConfigService,
  ],
  controllers: [EmailTemplateController],
})
export class EmailTemplateModule {}
