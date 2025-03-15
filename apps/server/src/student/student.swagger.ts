import { HttpStatus } from '@nestjs/common';

export const swaggerPaginateStudent = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    count: 1,
    data: [
      {
        id: 8,
        user: {
          id: 'STUD1001',
          name: 'James Smith',
          email: 'hidragaspi@gufum.com',
          phone: '(026) 620-3090',
          imagePath: null,
          role: 'STUDENT',
        },
        department: {
          id: 7,
          name: 'Department of History',
        },
      },
    ],
  },
};

export const swaggerCreateStudent = {
  description: 'OK',
  status: HttpStatus.CREATED,
  example: {
    message: 'Student added successfully',
    data: {
      id: 1,
      department: {
        id: 7,
        name: 'Department of History',
      },
      user: {
        name: 'James Smith',
        role: 'STUDENT',
        email: 'hidragaspi@gufum.com',
        phone: '(026) 620-3090',
        id: 'STUD1001',
        imagePath: null,
      },
    },
  },
};

export const swaggerUpdateStudent = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Student updated successfully',
    data: {
      id: 1,
      department: {
        id: 7,
        name: 'Department of History',
      },
      user: {
        name: 'James Smith',
        role: 'STUDENT',
        email: 'hidragaspi@gufum.com',
        phone: '(026) 620-3090',
        id: 'LECT1001',
        imagePath: null,
      },
    },
  },
};

export const swaggerRemoveStudent = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Student removed successfully',
  },
};
