import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
  swaggerLogoutResponse,
  swaggerRequestPasswordResetResponse,
  swaggerResetPasswordResponse,
  swaggerValidateRefreshTokenResponse,
  swaggerValidateResetTokenResponse,
} from './auth.swagger';
import { RequestPasswordReset } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse(swaggerLoginResponse)
  @UseInterceptors(ClassSerializerInterceptor)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @HttpCode(HttpStatus.OK)
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

  @ApiResponse(swaggerValidateRefreshTokenResponse)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('validate-token')
  async validateRefreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['_ref-tk'] as string;
    const result = await this.authService.validateRefreshToken(refreshToken);

    this.setAuthCookie(res, result.token);

    return { data: result.data };
  }

  @ApiResponse(swaggerRequestPasswordResetResponse)
  @Post('request-password-reset')
  @HttpCode(HttpStatus.OK)
  requestPasswordReset(@Body(ValidationPipe) body: RequestPasswordReset) {
    return this.authService.requestPasswordReset(body.email);
  }

  @ApiResponse(swaggerValidateResetTokenResponse)
  @Get('validate-reset-token')
  validateResetToken(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    return this.authService.validateResetToken(token);
  }

  @ApiResponse(swaggerResetPasswordResponse)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body(ValidationPipe) body: ResetPasswordDto,
    @Query('token') token: string,
  ) {
    if (body.confirmPassword !== body.newPassword) {
      throw new BadRequestException('Passwords do not match each other');
    }

    return this.authService.resetPassword(body.newPassword, token);
  }

  @ApiResponse(swaggerLogoutResponse)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('_auth-tk', '', {
      path: '/',
      maxAge: 0,
    });
    res.cookie('_ref-tk', '', {
      path: '/',
      maxAge: 0,
    });

    return { message: 'Successfully logged out of the application' };
  }
}
