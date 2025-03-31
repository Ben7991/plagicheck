import { HttpStatus } from '@nestjs/common';

export const swaggerPaginateArchive = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    count: 1,
    data: [
      {
        id: 5,
        title: 'Insurance-app.txt',
        createdAt: '2025-03-30T19:50:26.000Z',
        documentType: 'TEXT',
        filePath: '1743364226621.txt',
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
      title:
        'Aditya Bhargava - Grokking Algorithms_ An illustrated guide for programmers and other curious people-Manning Publications (2016)',
      documentType: 'PDF',
      department: {
        id: 43,
        name: 'Center for Teaching Support',
      },
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
