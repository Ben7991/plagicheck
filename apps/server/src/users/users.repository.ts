import { DataSource } from 'typeorm';

import { Role } from 'src/utils/enums/role.enum';
import { UserEntity } from 'src/entities/user.entity';

export class UsersRepository {
  constructor(private readonly dataSource: DataSource) {}

  async getNextId(preferredRole: Role) {
    const seed = 1000;
    const totalCount = await this.dataSource.manager.count(UserEntity, {
      where: { role: preferredRole },
    });

    if (preferredRole === Role.LECTURER) {
      return `LECT${totalCount + 1 + seed}`;
    }

    return `STUD${totalCount + 1 + seed}`;
  }

  /**
   * where value is either id or email
   * @param value string
   */
  async find(value: string) {
    if (value.includes('@')) {
      return this.dataSource.manager.findOneBy(UserEntity, {
        email: value,
      });
    }

    return this.dataSource.manager.findOneBy(UserEntity, {
      id: value,
    });
  }
}
