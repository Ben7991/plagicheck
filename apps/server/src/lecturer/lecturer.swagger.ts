import { HttpStatus } from '@nestjs/common';

export const swaggerPaginateLecturer = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    count: 1,
    data: [
      {
        id: 8,
        qualification: 'Bachelors of Computer Science',
        user: {
          id: 'LECT1001',
          name: 'James Smith',
          email: 'hidragaspi@gufum.com',
          phone: '(026) 620-3090',
          imagePath: null,
          role: 'LECTURER',
        },
        department: {
          id: 7,
          name: 'Department of History',
        },
      },
    ],
  },
};

export const swaggerCreateLecturer = {
  description: 'OK',
  status: HttpStatus.CREATED,
  example: {
    message: 'Lecturer added successfully',
    data: {
      id: 1,
      qualification: 'Bachelors Degree',
      department: {
        id: 7,
        name: 'Department of History',
      },
      user: {
        name: 'James Smith',
        role: 'LECTURER',
        email: 'hidragaspi@gufum.com',
        phone: '(026) 620-3090',
        id: 'LECT1001',
        imagePath: null,
      },
    },
  },
};

export const swaggerUpdateLecturer = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Lecturer updated successfully',
    data: {
      id: 1,
      qualification: 'Bachelors Degree',
      department: {
        id: 7,
        name: 'Department of History',
      },
      user: {
        name: 'James Smith',
        role: 'LECTURER',
        email: 'hidragaspi@gufum.com',
        phone: '(026) 620-3090',
        id: 'LECT1001',
        imagePath: null,
      },
    },
  },
};

export const swaggerRemoveLecturer = {
  description: 'OK',
  status: HttpStatus.OK,
  example: {
    message: 'Lecturer removed successfully',
  },
};
