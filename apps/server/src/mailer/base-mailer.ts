import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

@Injectable()
export abstract class BaseMailer<T> {
  constructor(protected readonly _configService: ConfigService) {}

  protected async _createTransport() {
    const transporter = createTransport({
      pool: true,
      secure: true,
      port: 465,
      host: this._configService.get<string>('mailer.host'),
      auth: {
        user: this._configService.get<string>('mailer.address')!,
        pass: this._configService.get<string>('mailer.password')!,
      },
    });

    const isVerified = await transporter.verify();

    if (!isVerified) {
      throw new Error('Mailer configuration mismatch');
    }

    return transporter;
  }

  protected abstract configureEmailBody(data: T): Promise<string>;
  abstract send(data: T): Promise<void>;
}
