import {
  Body,
  Controller,
  HttpException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { CommonInterceptor } from 'src/common.interceptor';
import {
  CreateEmailTemplateDto,
  UpdateEmailTemplateDto,
} from './dto/email_template.dto';
import { EmailTemplateService } from './email_template.service';
import { DefaultMessage, ResponseStatus } from 'src/constants';
import {
  getFieldsForSearch,
  getFiltersObject,
  convertToUppercase,
} from 'src/utils/querybuilder';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('email_template')
export class EmailTemplateController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {}

  async idValidate(id: string) {
    try {
      if (!isValidObjectId(id)) {
        throw new HttpException(
          DefaultMessage.NOT_EXISTS,
          ResponseStatus.BAD_REQUEST,
        );
      }
      const res = await this.emailTemplateService.findOne({
        _id: id,
      });
      if (!res) {
        throw new HttpException(
          DefaultMessage.NOT_EXISTS,
          ResponseStatus.BAD_REQUEST,
        );
      }
      return res;
    } catch {
      throw new HttpException(
        DefaultMessage.NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
  }

  async nameValidate(name, request, id = null) {
    if (request.method == 'PUT' && !id) {
      throw new HttpException(
        DefaultMessage.ID_MANDATORY,
        ResponseStatus.BAD_REQUEST,
      );
    }
    const arg =
      request.method == 'PUT'
        ? {
            name_var: name,
            _id: { $ne: id },
          }
        : {
            name_var: name,
          };

    const res = await this.emailTemplateService.findOne(arg);
    if (res) {
      throw new HttpException(
        DefaultMessage.EMAIL_TEMPLATE_EXIST,
        ResponseStatus.BAD_REQUEST,
      );
    }
    return res;
  }

  @Post('/new')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor(), new CommonInterceptor())
  async createEmailTemplate(
    @Req() req: Express.Request,
    @Body() body: CreateEmailTemplateDto,
  ) {
    const { name } = body;
    const name_var = convertToUppercase(name);
    await this.nameValidate(name_var, req);
    try {
      const res = await this.emailTemplateService.create({ name_var, ...body });
      return {
        success: true,
        data: { data: res, message: 'Emailtemplate created successfully' },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/index')
  @UseGuards(AuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async findAllEmailTemplate(@Body() body) {
    try {
      const fields = getFieldsForSearch(body, ['name']);
      const payload = getFiltersObject(body, fields);
      const data = await this.emailTemplateService.findAll(payload);
      return {
        success: true,
        data: { data: data, message: 'Records fetched successfully' },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(AnyFilesInterceptor(), new CommonInterceptor())
  async updateEmailTemplate(
    @Req() req: Express.Request,
    @Param('id') id: string,
    @Body() body: UpdateEmailTemplateDto,
  ) {
    await this.idValidate(id);
    const { name } = body;
    const name_var = convertToUppercase(name);
    await this.nameValidate(name_var, req, id);
    try {
      const res = await this.emailTemplateService.update(id, {
        name_var,
        ...body,
      });
      return {
        success: true,
        data: { data: res, message: 'Emailtemplate updated successfully' },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status ? error.status : ResponseStatus.BAD_REQUEST,
      );
    }
  }
}
