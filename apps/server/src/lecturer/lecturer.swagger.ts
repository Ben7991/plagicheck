import { HttpStatus } from '@nestjs/common';

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
