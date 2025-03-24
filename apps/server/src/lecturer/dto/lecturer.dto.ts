import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Matches } from 'class-validator';

export class LecturerDto {
  @IsNotEmpty()
  @Matches(/^[a-zA-Z ]*$/)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/)
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  departmentId: number;

  @IsNotEmpty()
  @ApiProperty()
  qualification: string;
}
