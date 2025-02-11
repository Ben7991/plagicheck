import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  swaggerLoginResponse,
  swaggerValidateTokenResponse,
} from './auth.swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse(swaggerLoginResponse)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
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
    res.cookie('_auth-tk', token.accessToken, {
      path: '/',
      maxAge: accessTokenDuration,
    });

    const refreshTokenDuration = 60 * 60 * 24 * 30 * 1000;
    res.cookie('_ref-tk', token.refreshToken, {
      path: '/',
      maxAge: refreshTokenDuration,
      httpOnly: true,
    });
  }

  @ApiResponse(swaggerValidateTokenResponse)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('validate-token')
  async validateToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['_ref-tk'] as string;
    const result = await this.authService.validateToken(refreshToken);

    this.setAuthCookie(res, result.token);

    return { data: result.data };
  }
}
