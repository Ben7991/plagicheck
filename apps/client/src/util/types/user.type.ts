import { Role } from '../enum/role.enum';
import { Department } from './department.type';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  imagePath: string | null;
  role: Role;
};

export type Lecturer = {
  id: number;
  qualification: string;
  department: Department;
  user: User;
};

export type Student = Omit<Lecturer, 'qualification'>;
