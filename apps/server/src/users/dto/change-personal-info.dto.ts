import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class ChangePersonalInfoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsAlpha()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsAlpha()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
  phone: string;
}
