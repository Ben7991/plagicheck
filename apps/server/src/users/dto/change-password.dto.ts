import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  currentPassword: string;

  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty()
  newPassword: string;

  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;
}
