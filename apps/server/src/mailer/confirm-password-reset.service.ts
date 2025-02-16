import { Injectable } from '@nestjs/common';
import { BaseMailer } from './base-mailer';
import { UserEntity } from 'src/entities/user.entity';
import { join } from 'path';
import { renderFile } from 'ejs';
import { OnEvent } from '@nestjs/event-emitter';
import { CONFIRM_PASSWORD_RESET } from './event-identifies';

@Injectable()
export class ConfirmPasswordResetService extends BaseMailer<
  Pick<UserEntity, 'name' | 'email'>
> {
  protected override configureEmailBody(
    data: Pick<UserEntity, 'name' | 'email'>,
  ): Promise<string> {
    const templatePath = join(
      process.cwd(),
      'views',
      'fconfirm-password-reset.ejs',
    );
    return renderFile(templatePath, data);
  }

  @OnEvent(CONFIRM_PASSWORD_RESET)
  override async send(data: Pick<UserEntity, 'name' | 'email'>): Promise<void> {
    const mailBody = await this.configureEmailBody(data);
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
