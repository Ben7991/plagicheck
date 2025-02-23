import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

import {
  swaggerChangePasswordResponse,
  swaggerChangePersonalInfoResponse,
} from './user.swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { ChangePersonalInfoDto } from './dto/change-personal-info.dto';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse(swaggerChangePasswordResponse)
  @Post('password')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Body(ValidationPipe) body: ChangePasswordDto,
    @Req() req: Request,
  ) {
    if (body.newPassword !== body.confirmPassword) {
      throw new BadRequestException(
        'Confirm password does not match new password',
      );
    }

    const user = req['user'] as UserEntity;
    return this.userService.changePassword(
      body.currentPassword,
      body.newPassword,
      user,
    );
  }

  @ApiBearerAuth()
  @ApiResponse(swaggerChangePersonalInfoResponse)
  @UseGuards(AuthGuard)
  @Post('personal-info')
  @HttpCode(HttpStatus.OK)
  changePersonalInfo(
    @Body(ValidationPipe) body: ChangePersonalInfoDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as UserEntity;
    return this.userService.changePersonalInfo(body, user);
  }
}
