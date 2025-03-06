import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { UserEntity } from 'src/entities/user.entity';
import { AccessRole } from '../decorators/acces-role.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const role = this.reflector.get(AccessRole, context.getHandler());

    const req = context.switchToHttp().getRequest<Request>();
    const user = req['user'] as UserEntity;

    return user.role === role;
  }
}
