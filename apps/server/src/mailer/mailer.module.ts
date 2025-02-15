import { Module } from '@nestjs/common';
import { ForgotPasswordService } from './forgot-password.service';

@Module({
  providers: [ForgotPasswordService],
})
export class MailerModule {}
