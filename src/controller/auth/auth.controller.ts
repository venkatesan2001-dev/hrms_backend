import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CommonInterceptor } from '../../common.interceptor';
import {
  DefaultMessage,
  EmailTemplatesConfig,
  ReportSampleConfig,
  ResponseStatus,
} from '../../constants';
import { AuthService } from './auth.service';
import {
  ChnagePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  ResetPasswordParamsDto,
} from './dto/auth.dto';
import { MailConfigService } from '../../utils/mail.config';
import { atob } from 'buffer';
import { AuthGuard } from './auth.guard';
import { EmailTemplateService } from '../email_template/email_template.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly mailConfigService: MailConfigService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  isActiveRole(employee) {
    if (!employee.status) {
      throw new HttpException(
        DefaultMessage.INACTIVE_USER,
        ResponseStatus.BAD_REQUEST,
      );
    }
    return employee;
  }

  @Post('/login')
  @UseInterceptors(new CommonInterceptor())
  async login(@Body() body: LoginDto) {
    const employee = await this.authService.findOneEmployee(body);
    if (!employee) {
      throw new HttpException(
        DefaultMessage.INVALID_CREDENTIAL,
        ResponseStatus.FORBIDDEN,
      );
    }
    this.isActiveRole(employee);
    const tokenload = {
      id: employee._id,
      email: employee.email,
    };
    const privateKey = process.env.JWT_SECRET_KEY;
    const options = {
      secret: privateKey,
      expiresIn: process.env.JWT_EXPIRE,
    };
    const token = this.jwtService.sign(tokenload, options);
    return {
      success: true,
      data: { message: 'Login Successfully', data: { token } },
    };
  }
  @Post('/forgot_password')
  @UseInterceptors(new CommonInterceptor())
  async forgot_password(@Body() body: ForgotPasswordDto, @Req() req) {
    const { email, redirect_url } = body;
    const isUserExist = await this.authService.findOne({ email: email });
    if (!isUserExist) {
      throw new HttpException(
        DefaultMessage.USER_NOT_EXISTS,
        ResponseStatus.BAD_REQUEST,
      );
    }
    if (!isUserExist.status) {
      throw new HttpException(
        DefaultMessage.INACTIVE_USER,
        ResponseStatus.BAD_REQUEST,
      );
    }
    const secret_key = isUserExist.password;
    const options = {
      secret: secret_key,
      expiresIn: '5m',
    };
    const tokenload = {
      _id: isUserExist._id,
    };
    const token = this.jwtService.sign(tokenload, options);
    const url = process.env.CLIENT_URL;
    const authenticity_link =
      url + redirect_url + '?token=' + token + '&id=' + btoa(isUserExist._id);
    const email_template_data = await this.emailTemplateService.findOne({
      name_var: EmailTemplatesConfig.FORGET_PASSWORD,
    });
    const html_content = email_template_data
      ? email_template_data.content
      : '<p>N/A<p>';
    const subject = email_template_data
      ? email_template_data.subject
      : 'Password Reset Link';
    this.mailConfigService.mailFunction(
      body.email.toString(),
      subject,
      html_content
        .replace(
          '{{FIRST_NAME}}',
          isUserExist.first_name
            ? isUserExist.first_name
            : DefaultMessage.NOT_AVAILABLE,
        )
        .replace(
          '{{AUTHENTICITYLINK}}',
          authenticity_link ? authenticity_link : DefaultMessage.NOT_AVAILABLE,
        )
        .replace('{{DISCLAIMER}}', EmailTemplatesConfig.DISCLAIMER),
    );
    return {
      success: true,
      data: { message: 'Reset Link Sent Successfully' },
    };
  }

  @Post('/reset_password')
  @UseInterceptors(new CommonInterceptor())
  async reset_password(
    @Body() body: ResetPasswordDto,
    @Query() params: ResetPasswordParamsDto,
  ) {
    try {
      const { password } = body;
      const { id, token } = params;
      const decoded_id = atob(id);
      const isUserExist = await this.authService.findOne({ _id: decoded_id });
      await this.isActiveRole(isUserExist);
      const data = await this.jwtService.verify(token, {
        secret: isUserExist.password,
      });
      if (decoded_id === data._id) {
        this.authService.changePassword(decoded_id, password, isUserExist);
      }
      return {
        success: true,
        data: { message: 'Password Changed Successfully' },
      };
    } catch (e) {
      throw new HttpException(
        DefaultMessage.INVALID_LINK,
        ResponseStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/change_password')
  @UseGuards(AuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async change_password(@Body() body: ChnagePasswordDto, @Req() req) {
    const { user } = req;
    const { old_password, new_password } = body;
    const employee_data = await this.authService.findOne({ _id: user._id });
    const hashed_old_password =
      await this.authService.hashPassword(old_password);
    if (old_password === new_password) {
      throw new HttpException(
        DefaultMessage.OLD_PASS_NEW_PASS_SAME,
        ResponseStatus.BAD_REQUEST,
      );
    }
    if (hashed_old_password !== employee_data.password) {
      throw new HttpException(
        DefaultMessage.OLD_PASSWORD_INCORRECT,
        ResponseStatus.BAD_REQUEST,
      );
    }
    await this.authService.changePassword(
      user._id,
      new_password,
      employee_data,
    );
    return {
      success: true,
      data: { message: 'Password Changed Successfully' },
    };
  }

  @Get('/current_user_detail')
  @UseGuards(AuthGuard)
  @UseInterceptors(new CommonInterceptor())
  async current_user_detail(@Req() req) {
    const { user } = req;
    // const employee_data = await this.authService.findOne({ _id: user._id });
    // const obj_employee_data = employee_data.toObject();
    // delete obj_employee_data.password;
    return {
      success: true,
      data: {
        data: user,
        message: 'Current user details fetched Successfully',
      },
    };
  }
}
