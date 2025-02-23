import { HttpStatus } from '@nestjs/common';

export const swaggerChangePasswordResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Successfully changed your password',
  },
};

export const swaggerChangePersonalInfoResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Successfully, changed your personal information',
  },
};
