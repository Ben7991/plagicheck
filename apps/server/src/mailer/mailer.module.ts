import { Module } from '@nestjs/common';

import { ForgotPasswordService } from './forgot-password.service';
import { ConfirmPasswordResetService } from './confirm-password-reset.service';

@Module({
  providers: [ForgotPasswordService, ConfirmPasswordResetService],
})
export class MailerModule {}
