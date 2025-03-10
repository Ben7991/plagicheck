import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { Hash } from 'src/utils/hash.util';
import { ChangePersonalInfoDto } from './dto/change-personal-info.dto';
import { unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

import { AccountStatus } from 'src/utils/enums/account-status.enum';

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
      if (error as BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }
      throw new InternalServerErrorException((error as Error).message);
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
      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async checkEmail(email: string, user: UserEntity) {
    try {
      const existingUserWithEmail = await this.dataSource.manager
        .getRepository(UserEntity)
        .findOneBy({ email });

      if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
        throw new BadRequestException('Email already taken');
      }

      return { code: 'SUCCESS' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async changeImage(filePath: string, user: UserEntity) {
    try {
      if (user.imagePath) {
        const imagePath = join(process.cwd(), 'uploads', user.imagePath);

        if (existsSync(imagePath)) {
          await unlink(imagePath);
        }
      }

      user.imagePath = filePath;
      await this.dataSource.manager.getRepository(UserEntity).save(user);

      return {
        message: 'Image uploaded successfully',
        data: {
          path: user.imagePath,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async removeAccount(user: UserEntity) {
    try {
      user.accountStatus = AccountStatus.SUSPENDED;
      await this.dataSource.manager.getRepository(UserEntity).save(user);

      return { message: 'Account deleted successfully' };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
