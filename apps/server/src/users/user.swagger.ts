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

export const swaggerCheckEmailResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: { code: 'SUCCESS' },
};

export const swaggerChangeImageResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Image uploaded successfully',
    data: {
      path: 'uploads/1740600081996.jpg',
    },
  },
};

export const swaggerRemoveAccountResponse = {
  status: HttpStatus.OK,
  description: 'OK',
  example: {
    message: 'Account deleted successfully',
  },
};
