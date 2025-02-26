import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
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
import { join } from 'node:path';
import { diskStorage } from 'multer';

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

  @ApiResponse(swaggerChangePersonalInfoResponse)
  @Post('personal-info')
  @HttpCode(HttpStatus.OK)
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
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter(_, file, callback) {
        const acceptableMimeTypes = ['image/jpg', 'image/png', 'image/jpeg'];
        const fileMimeType = file.mimetype.toLocaleLowerCase();

        if (acceptableMimeTypes.includes(fileMimeType)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      storage: diskStorage({
        destination(_, __, callback) {
          callback(null, join(process.cwd(), 'uploads'));
        },
        filename(_, file, callback) {
          if (!file) {
            callback(null, '');
          }
          const extensionIndex = file.originalname.lastIndexOf('.');
          const extension = file.originalname.substring(
            extensionIndex + 1,
            file.originalname.length,
          );
          const fileName = `${Date.now()}.${extension}`;
          callback(null, fileName);
        },
      }),
    }),
  )
  changeImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    if (!file) {
      throw new BadRequestException(
        'Only images with extension jpg, png and jpeg are accepted',
      );
    }

    const user = <UserEntity>req['user'];
    return this.userService.changeImage(file.filename, user);
  }

  @Delete()
  @ApiResponse(swaggerRemoveAccountResponse)
  removeAccount(@Req() req: Request) {
    const user = <UserEntity>req['user'];
    return this.userService.removeAccount(user);
  }
}
