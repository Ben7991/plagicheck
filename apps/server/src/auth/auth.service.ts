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

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, accountStatus, ...remainingProps } = existingUser;
      const token = await this.createAuthToken(existingUser);

      return { data: remainingProps, token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      } else {
        throw new InternalServerErrorException('Something went wrong');
      }
    }
  }

  private async createAuthToken(user: UserEntity) {
    const saltRounds = 10;
    const hashedId = await bcryptjs.hash(user.id, saltRounds);
    const accessToken = jwt.sign({ sub: hashedId }, this.secretKey, {
      expiresIn: '15m',
    });

    const hashedPassword = await bcryptjs.hash(user.email, saltRounds);
    const refreshToken = jwt.sign(
      { sub: hashedId, email: hashedPassword },
      this.secretKey,
      { expiresIn: '30d' },
    );

    return { accessToken, refreshToken };
  }
}
