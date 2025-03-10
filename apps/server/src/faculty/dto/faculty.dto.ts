import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FacultyDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
}
