import { HttpStatus } from '@nestjs/common';

export const swaggerLoginResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Correct credentials',
    data: {
      id: '******',
      name: '******',
      email: '******',
      phone: '000-000-000',
      imagePath: null,
      role: '******',
    },
  },
};

export const swaggerValidateRefreshTokenResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    data: {
      id: '******',
      name: '******',
      email: '******',
      phone: '000-000-000',
      imagePath: null,
      role: '******',
    },
  },
};

export const swaggerRequestPasswordResetResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Please check your email to complete the process',
  },
};

export const swaggerValidateResetTokenResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    code: 'SUCCESS',
  },
};

export const swaggerResetPasswordResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Successfully reset your password',
  },
};

export const swaggerLogoutResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Successfully logged out of the application',
  },
};

export const swaggerRefreshTokenResponse = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    code: 'SUCCESS',
  },
};
