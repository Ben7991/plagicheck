import { Entity, PrimaryColumn, Column } from 'typeorm';

import { AccountStatus } from 'src/utils/enums/account-status.enum';
import { Role } from 'src/utils/enums/role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 15,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
  })
  phone: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({
    type: 'enum',
    name: 'account_status',
    enum: AccountStatus,
    default: AccountStatus.ACTIVE,
  })
  accountStatus: AccountStatus;
}
