import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { LecturerService } from './lecturer.service';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import { LecturerDto } from './dto/lecturer.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import {
  swaggerCreateLecturer,
  swaggerPaginateLecturer,
  swaggerUpdateLecturer,
} from './lecturer.swagger';

@Controller('lecturers')
@UseFilters(InternalServerErrorExceptionFilter)
export class LecturerController {
  constructor(private readonly lecturerService: LecturerService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse(swaggerPaginateLecturer)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  paginate(@Query('page') page?: string, @Query('q') query?: string) {
    const parsedPage = !page ? 0 : parseInt(page);

    if (Number.isNaN(parsedPage)) {
      throw new BadRequestException('Invalid page number');
    }

    return this.lecturerService.paginate(parsedPage, query ?? '');
  }

  @ApiResponse(swaggerCreateLecturer)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Lecturer added successfully'))
  @Post()
  create(@Body(ValidationPipe) body: LecturerDto) {
    return this.lecturerService.create(body);
  }

  @ApiResponse(swaggerUpdateLecturer)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Lecturer updated successfully'))
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) body: LecturerDto) {
    return this.lecturerService.update(body, id);
  }
}
