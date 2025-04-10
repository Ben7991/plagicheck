import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

export const AccessRoles = Reflector.createDecorator<Role[]>();
