import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { verify } from 'jsonwebtoken';
import { DataSource } from 'typeorm';

import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;

    if (!authorization) {
      throw new UnauthorizedException('Access denied');
    }

    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Access denied');
    }

    try {
      const secretKey = this.configService.get<string>('secret')!;
      const result = verify(token, secretKey) as unknown as { sub: string };

      const authUser = await this.dataSource.manager
        .getRepository(UserEntity)
        .findOneBy({
          id: result.sub,
        });

      if (!authUser) {
        throw new Error();
      }

      request['user'] = authUser;

      return true;
    } catch {
      throw new UnauthorizedException('Acess denied');
    }
  }
}
