import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordReset {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;
}
