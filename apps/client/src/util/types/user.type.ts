import { Role } from '../enum/role.enum';

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  imagePath: string | null;
  role: Role;
};
