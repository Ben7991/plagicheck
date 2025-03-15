import { Injectable } from '@nestjs/common';
import { join } from 'node:path';
import { renderFile } from 'ejs';

import { BaseMailer } from './base-mailer';
import { UserEntity } from 'src/entities/user.entity';
import { OnEvent } from '@nestjs/event-emitter';
import { INVITATION } from './event-identifies';

@Injectable()
export class InvitationMailerService extends BaseMailer<
  Pick<UserEntity, 'name' | 'email' | 'password' | 'id'>
> {
  protected override _configureEmailBody(
    data: Pick<UserEntity, 'name' | 'email' | 'id' | 'password'>,
  ): Promise<string> {
    const templatePath = join(process.cwd(), 'views', 'invitation.ejs');
    return renderFile(templatePath, data);
  }

  @OnEvent(INVITATION)
  override async send(
    data: Pick<UserEntity, 'name' | 'email' | 'id' | 'password'>,
  ): Promise<void> {
    const mailBody = await this._configureEmailBody(data);
    const transporter = await this._createTransport();

    await transporter.sendMail({
      to: data.email,
      subject: 'Invitation to Join Plagiarism Checker System',
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
