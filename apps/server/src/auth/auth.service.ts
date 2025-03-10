import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { UserEntity } from 'src/entities/user.entity';
import { AccountStatus } from 'src/utils/enums/account-status.enum';
import {
  CONFIRM_PASSWORD_RESET,
  FORGOT_PASSWORD_KEY,
} from 'src/mailer/event-identifies';
import { Hash } from 'src/utils/hash.util';

@Injectable()
export class AuthService {
  private secretKey: string;

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
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
      }
      throw new InternalServerErrorException((error as Error).message);
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

  async validateRefreshToken(refreshToken: string) {
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
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async requestPasswordReset(email: string) {
    try {
      const existingUser = await this.dataSource
        .createQueryBuilder(UserEntity, 'users')
        .where({ email })
        .getOne();

      if (!existingUser) {
        throw new BadRequestException(
          'Please check your email to complete the process',
        );
      }

      const token = jwt.sign({ sub: existingUser.id }, this.secretKey, {
        expiresIn: '1hr',
      });

      // responsible for emitting a message to a mailer to send email
      this.eventEmitter.emit(FORGOT_PASSWORD_KEY, {
        token,
        email: existingUser.email,
        name: existingUser.name,
      });

      return {
        message: 'Please check your email to complete the process',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  validateResetToken(token: string) {
    try {
      jwt.verify(token, this.secretKey);
      return { code: 'SUCCESS' };
    } catch {
      throw new BadRequestException('Invalid token');
    }
  }

  async resetPassword(newPassword: string, token: string) {
    try {
      const result = jwt.verify(token, this.secretKey) as unknown as {
        sub: string;
      };
      const existingUser = await this.dataSource
        .createQueryBuilder(UserEntity, 'users')
        .where({
          id: result.sub,
        })
        .getOne();

      if (!existingUser) {
        throw new BadRequestException('Something went wrong');
      }

      const hashedPassword = await Hash.create(newPassword);
      existingUser.password = hashedPassword;
      await this.dataSource.manager.save(existingUser);

      this.eventEmitter.emit(CONFIRM_PASSWORD_RESET, {
        name: existingUser.name,
        email: existingUser.email,
      });

      return {
        message: 'Successfully reset your password',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async refreshToken(token: string) {
    try {
      const result = jwt.verify(token, this.secretKey) as unknown as {
        sub: string;
        email: string;
      };

      if (!result.sub || !result.email) {
        throw new UnauthorizedException();
      }

      const existingUser = await this.dataSource.manager
        .getRepository(UserEntity)
        .findOneBy({ id: result.sub });

      if (!existingUser) {
        throw new UnauthorizedException();
      }

      const sameEmail = await bcryptjs.compare(
        existingUser.email,
        result.email,
      );

      if (!sameEmail) {
        throw new UnauthorizedException();
      }

      return this.createAuthToken(existingUser);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Access denied');
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
