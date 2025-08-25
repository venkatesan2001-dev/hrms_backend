import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employee } from './schema/employee.schema';
import { Model } from 'mongoose';
import { findAndPaginateData } from '../../utils/querybuilder';
import { ConfigService } from '@nestjs/config';
import { MailConfigService } from '../../utils/mail.config';
import { EmailTemplateService } from '../email_template/email_template.service';
import { DefaultMessage, EmailTemplatesConfig } from '../../constants';

const { pbkdf2 } = require('node:crypto');

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private employeeModel: Model<Employee>,
    private readonly configService: ConfigService,
    private readonly mailConfigService: MailConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  pbkdf2Promise(password: string, salt: string) {
    return new Promise((resolve, reject) => {
      pbkdf2(password, salt, 1000, 64, 'sha256', (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString('hex'));
      });
    });
  }

  async create(payload) {
    let password = Math.random().toString(36).slice(2);
    const hashed_password = await this.pbkdf2Promise(
      password,
      this.configService.get('HASH_SECRET_KEY'),
    );
    payload.password = hashed_password;
    const data = await this.employeeModel.create(payload);
    const email_template_data = await this.emailTemplateService.findOne({
      name_var: EmailTemplatesConfig.EMPLOYEE_CREATE,
    });
    const html_content = email_template_data
      ? email_template_data.content
      : `<p>User ID : ${data.employee_id}, Password:  ${password}</p>`;
    const subject = email_template_data
      ? email_template_data.subject
      : 'User created successfully';
    this.mailConfigService.mailFunction(
      data.email.toString(),
      subject,
      html_content
        .replace(
          '{{FIRST_NAME}}',
          data.first_name ? data.first_name : DefaultMessage.NOT_AVAILABLE,
        )
        .replace(
          '{{EMPLOYEE_ID}}',
          data.employee_id ? data.employee_id : DefaultMessage.NOT_AVAILABLE,
        )
        .replace(
          '{{PASSWORD}}',
          password ? password : DefaultMessage.NOT_AVAILABLE,
        )
        .replace('{{DISCLAIMER}}', EmailTemplatesConfig.DISCLAIMER)
        .replaceAll('{{DOMAINURL}}', this.configService.get('CLIENT_URL')),
    );
    return data;
  }

  async findAll(payload: object): Promise<any> {
    const data = await findAndPaginateData(payload, this.employeeModel);
    return data;
  }

  async findByIdAndUpdate(where: object, payload: object): Promise<any> {
    const data = await this.employeeModel.findByIdAndUpdate(where, payload, {
      new: true,
    });
    return data;
  }

  async findOne(payload: object): Promise<any> {
    const data = await this.employeeModel
      .findOne(payload)
      .collation({ locale: 'en', strength: 2 });
    return data;
  }

  async findLast(): Promise<any> {
    const data = await this.employeeModel.findOne().sort({ _id: -1 });
    return data;
  }
}
