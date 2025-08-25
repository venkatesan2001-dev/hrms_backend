import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { EmailTemplate } from './schema/email_template.schema';
import { Model } from 'mongoose';
import { findAndPaginateData } from 'src/utils/querybuilder';

@Injectable()
export class EmailTemplateService {
  constructor(
    @InjectModel(EmailTemplate.name)
    private emailTemplateModel: Model<EmailTemplate>,
  ) {}
  async create(payload: object) {
    const data = await this.emailTemplateModel.create(payload);
    return data;
  }

  async findAll(payload: object) {
    const data = await findAndPaginateData(payload, this.emailTemplateModel);
    return data;
  }

  async findOne(payload: object): Promise<any> {
    const data = await this.emailTemplateModel
      .findOne(payload)
      .collation({ locale: 'en', strength: 2 });
    return data;
  }

  async update(id: string, payload: object) {
    const data = await this.emailTemplateModel.findByIdAndUpdate(id, payload, {
      new: true,
    });
    return data;
  }
}
