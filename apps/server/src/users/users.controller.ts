import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from 'src/auth/auth.guard';
import {
  swaggerChangeImageResponse,
  swaggerChangePasswordResponse,
  swaggerChangePersonalInfoResponse,
  swaggerCheckEmailResponse,
  swaggerRemoveAccountResponse,
} from './user.swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserEntity } from 'src/entities/user.entity';
import { UsersService } from './users.service';
import { ChangePersonalInfoDto } from './dto/change-personal-info.dto';
import { CheckEmailDto } from './dto/check-email.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ChangeImageDto } from './dto/change-image.dto';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import { uploadValidation } from './image-upload.multer';

@ApiBearerAuth()
@ApiTags('Users')
@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse(swaggerChangePasswordResponse)
  @Post('password')
  @HttpCode(HttpStatus.OK)
  @UseFilters(InternalServerErrorExceptionFilter)
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

  @ApiResponse(swaggerChangePersonalInfoResponse)
  @Post('personal-info')
  @HttpCode(HttpStatus.OK)
  @UseFilters(InternalServerErrorExceptionFilter)
  changePersonalInfo(
    @Body(ValidationPipe) body: ChangePersonalInfoDto,
    @Req() req: Request,
  ) {
    const user = req['user'] as UserEntity;
    return this.userService.changePersonalInfo(body, user);
  }

  @ApiResponse(swaggerCheckEmailResponse)
  @Post('check-email')
  @HttpCode(HttpStatus.OK)
  @UseFilters(InternalServerErrorExceptionFilter)
  checkEmail(@Body(ValidationPipe) body: CheckEmailDto, @Req() req: Request) {
    const user = req['user'] as UserEntity;
    return this.userService.checkEmail(body.email, user);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: ChangeImageDto,
  })
  @ApiResponse(swaggerChangeImageResponse)
  @Post('change-image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', uploadValidation))
  @UseFilters(InternalServerErrorExceptionFilter)
  changeImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException(
        'Only images with extension jpg, png and jpeg are accepted',
      );
    }

    const user = <UserEntity>req['user'];
    return this.userService.changeImage(file.filename, user);
  }

  @ApiResponse(swaggerRemoveAccountResponse)
  @Delete(':id')
  @UseFilters(InternalServerErrorExceptionFilter)
  removeAccount(@Req() req: Request, @Param('id') userId: string) {
    const user = <UserEntity>req['user'];

    if (user.id !== userId) {
      throw new ForbiddenException('Not allowed');
    }

    return this.userService.removeAccount(user);
  }
}
