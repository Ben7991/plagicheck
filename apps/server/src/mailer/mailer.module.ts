import { Module } from '@nestjs/common';

import { ForgotPasswordService } from './forgot-password.service';
import { ConfirmPasswordResetService } from './confirm-password-reset.service';
import { InvitationMailerService } from './invitation.service';

@Module({
  providers: [
    ForgotPasswordService,
    ConfirmPasswordResetService,
    InvitationMailerService,
  ],
})
export class MailerModule {}
