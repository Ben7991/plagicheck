import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { Hash } from 'src/utils/hash.util';
import { ChangePersonalInfoDto } from './dto/change-personal-info.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dataSource: DataSource) {}

  async changePassword(
    currentPassword: string,
    newPassword: string,
    user: UserEntity,
  ) {
    try {
      const samePassword = await bcryptjs.compare(
        currentPassword,
        user.password,
      );

      if (!samePassword) {
        throw new BadRequestException(
          'Currrent password does not much existing one',
        );
      }

      const hashedPassword = await Hash.create(newPassword);
      user.password = hashedPassword;

      await this.dataSource.manager.save(user);

      return { message: 'Successfully changed your password' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }

  async changePersonalInfo(body: ChangePersonalInfoDto, user: UserEntity) {
    try {
      const existingUserWithEmail = await this.dataSource.manager
        .getRepository(UserEntity)
        .findOneBy({
          email: body.email,
        });

      if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
        throw new BadRequestException('Email already taken');
      }

      user.name = `${body.firstName} ${body.lastName}`;
      user.phone = body.phone;
      user.email = body.email;

      await this.dataSource.manager.save(user);

      return { message: 'Successfully, changed your personal information' };
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }
  }
}
