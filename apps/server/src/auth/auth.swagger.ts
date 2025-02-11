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

export const swaggerValidateTokenResponse = {
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
