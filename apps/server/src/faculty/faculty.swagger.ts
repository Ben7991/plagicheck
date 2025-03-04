import { HttpStatus } from '@nestjs/common';

export const swaggerCreateFaculty = {
  description: 'OK',
  status: HttpStatus.CREATED,
  example: {
    message: 'Faculty added successfully',
    data: {
      name: 'Faculty of Business',
      id: 1,
    },
  },
};

export const swaggerUpdateFaculty = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Faculty updated successfully',
    data: {
      name: 'Faculty of Business',
      id: 1,
    },
  },
};

export const swaggerPaginateFaculty = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    count: 2,
    data: [
      {
        id: 1,
        name: 'Faculty of Business',
      },
      {
        id: 2,
        name: 'School of Creative Arts',
      },
    ],
  },
};
