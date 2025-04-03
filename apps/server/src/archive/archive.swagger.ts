import { HttpStatus } from '@nestjs/common';

export const swaggerPaginateArchive = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    count: 1,
    data: [
      {
        id: 5,
        title: 'Insurance-app',
        createdAt: '2025-03-30T19:50:26.000Z',
        documentType: 'TEXT',
      },
    ],
  },
};

export const swaggerCreateArchive = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Archive added successfully',
    data: {
      id: 7,
      createdAt: '2025-03-31T07:54:35.000Z',
      title: 'Insurance-app',
      documentType: 'PDF',
    },
  },
};

export const swaggerRemoveArchive = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Archive deleted successfully',
  },
};
