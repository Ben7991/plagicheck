import { UserEntity } from 'src/entities/user.entity';

export type ForgotPasswordData = {
  token: string;
} & Pick<UserEntity, 'email' | 'name'>;
