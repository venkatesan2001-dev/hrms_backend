import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailConfigService {
  constructor() {}

  mailFunction(email: string, subject: string, textContent: string) {
    // const SibApiV3Sdk = require('sib-api-v3-sdk');
    // const defaultClient = SibApiV3Sdk.ApiClient.instance;
    // defaultClient.authentications['api-key'].apiKey =
    //   this.configService.get<string>('BREVO_API_KEY') || process.env.BREVO_API_KEY;
    // const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    // const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    // sendSmtpEmail.sender = {
    //   email: this.configService.get<string>('SENDER_EMAIL') || process.env.SENDER_EMAIL,
    //   name: this.configService.get<string>('SENDER_NAME') || process.env.SENDER_NAME,
    // };
    // sendSmtpEmail.to = [{ email: email }];
    // sendSmtpEmail.subject = subject;
    // sendSmtpEmail.htmlContent = textContent;
    // apiInstance.sendTransacEmail(sendSmtpEmail).then();
  }
}
