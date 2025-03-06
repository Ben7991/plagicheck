import { Reflector } from '@nestjs/core';
import { Role } from '../enums/role.enum';

export const AccessRole = Reflector.createDecorator<Role>();
