import { Role } from '../../../util/enum/role.enum';

export type AuthData = {
  id: string;
  email: string;
  imagePath: string | null;
  name: string;
  phone: string;
  role: Role;
};

export type AuthState = {
  isAuthenticated: boolean;
  data: AuthData | undefined;
};
