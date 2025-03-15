import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { LecturerService } from './lecturer.service';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import { LecturerDto } from './dto/lecturer.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import { swaggerCreateLecturer } from './lecturer.swagger';

@Controller('lecturers')
@UseFilters(InternalServerErrorExceptionFilter)
export class LecturerController {
  constructor(private readonly lectuerService: LecturerService) {}

  @ApiResponse(swaggerCreateLecturer)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Lecturer added successfully'))
  @Post()
  create(@Body(ValidationPipe) body: LecturerDto) {
    return this.lectuerService.create(body);
  }
}
