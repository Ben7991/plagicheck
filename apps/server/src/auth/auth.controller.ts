import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  async login(
    @Body(ValidationPipe) body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(body.username, body.password);

    this.setAuthCookie(res, result.token);

    return {
      message: 'Correct credentials',
      data: result.data,
    };
  }

  private setAuthCookie(
    res: Response,
    token: { accessToken: string; refreshToken: string },
  ) {
    const accessTokenDuration = 60 * 15 * 1000;
    res.cookie('_auth-tk', token, {
      path: '/',
      maxAge: accessTokenDuration,
    });

    const refreshTokenDuration = 60 * 60 * 24 * 30 * 1000;
    res.cookie('_ref-tk', token, {
      path: '/',
      maxAge: refreshTokenDuration,
      httpOnly: true,
    });
  }
}
