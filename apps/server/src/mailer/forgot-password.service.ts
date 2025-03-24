import { Injectable } from '@nestjs/common';
import { renderFile } from 'ejs';
import { join } from 'path';

import { BaseMailer } from './base-mailer';
import { OnEvent } from '@nestjs/event-emitter';
import { FORGOT_PASSWORD_KEY } from './event-identifies';
import { ForgotPasswordData } from './mailer.util';

@Injectable()
export class ForgotPasswordService extends BaseMailer<ForgotPasswordData> {
  protected _configureEmailBody(data: ForgotPasswordData): Promise<string> {
    const templatePath = join(process.cwd(), 'views', 'forgot-password.ejs');
    return renderFile(templatePath, data);
  }

  @OnEvent(FORGOT_PASSWORD_KEY)
  async send(data: ForgotPasswordData): Promise<void> {
    const mailBody = await this._configureEmailBody(data);
    const transporter = await this._createTransport();

    await transporter.sendMail({
      to: data.email,
      subject: 'Password Reset for Plagiarism Checker System',
      html: mailBody,
      from: {
        address: this._configService.get<string>('mailer.address')!,
        name: this._configService.get<string>('mailer.name')!,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
