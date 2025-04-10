import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateArchiveDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  departmentId: number;

  @IsNotEmpty()
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  file: Express.Multer.File;
}
