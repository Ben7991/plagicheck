import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from 'src/entities/user.entity';
import { AccountStatus } from 'src/utils/enums/account-status.enum';

@Injectable()
export class AuthService {
  private secretKey: string;

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    this.secretKey = this.configService.get<string>('secret')!;
  }

  async login(username: string, pass: string) {
    let existingUser: UserEntity | null = null;
    try {
      existingUser = await this.dataSource
        .createQueryBuilder(UserEntity, 'user')
        .where({ email: username })
        .orWhere({ id: username })
        .getOne();
      const hashedPassword = existingUser ? existingUser.password : '';
      const samePassword = await bcryptjs.compare(pass, hashedPassword);

      if (
        !existingUser ||
        !samePassword ||
        existingUser.accountStatus === AccountStatus.SUSPENDED
      ) {
        throw new BadRequestException('Wrong credentials');
      }

      const token = await this.createAuthToken(existingUser);

      return { data: existingUser, token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  private async createAuthToken(user: UserEntity) {
    const accessToken = jwt.sign({ sub: user.id }, this.secretKey, {
      expiresIn: '15m',
    });

    const saltRounds = 10;
    const hashedEmail = await bcryptjs.hash(user.email, saltRounds);
    const refreshToken = jwt.sign(
      { sub: user.id, email: hashedEmail },
      this.secretKey,
      { expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }

  async validateToken(refreshToken: string) {
    try {
      const result = jwt.verify(refreshToken, this.secretKey) as unknown as {
        sub: string;
        email: string;
      };
      const existingUser = await this.dataSource
        .createQueryBuilder(UserEntity, 'users')
        .where({ id: result.sub })
        .getOne();

      if (!existingUser) {
        throw new BadRequestException('Invalid token');
      }

      const isRightEmail = await bcryptjs.compare(
        existingUser.email,
        result.email,
      );

      if (!isRightEmail) {
        throw new BadRequestException('Invalid token');
      }

      const token = await this.createAuthToken(existingUser);

      return { data: existingUser, token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
