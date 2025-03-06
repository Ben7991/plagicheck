import { HttpStatus } from '@nestjs/common';

export const swaggerCreateDepartment = {
  description: 'OK',
  status: HttpStatus.CREATED,
  example: {
    message: 'Department added successfully',
    data: {
      id: 1,
      name: 'Department of Basic Education',
      faculty: {
        id: 1,
        name: 'Faculty of Business',
      },
    },
  },
};

export const swaggerUpdateDepartment = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Department updated successfully',
    data: {
      id: 1,
      name: 'Department of Basic Education',
      faculty: {
        id: 1,
        name: 'Faculty of Business',
      },
    },
  },
};

export const swaggerRemoveDepartment = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Department deleted successfully',
  },
};
