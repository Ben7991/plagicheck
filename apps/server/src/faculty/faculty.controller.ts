import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';

import { FacultyDto } from './dto/faculty.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import { FacultyService } from './faculty.service';
import {
  swaggerCreateFaculty,
  swaggerPaginateFaculty,
} from './faculty.swagger';
import { FacultyEntity } from 'src/entities/faculty.entity';

@Controller('faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse(swaggerPaginateFaculty)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  paginate(@Query('page') page?: string, @Query('q') query?: string) {
    const parsedPage = !page ? 0 : parseInt(page);

    if (Number.isNaN(parsedPage)) {
      throw new BadRequestException('Invalid page number');
    }

    return this.facultyService.paginage(parsedPage, query ?? '');
  }

  @ApiResponse(swaggerCreateFaculty)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new DataMessageInterceptor<FacultyEntity>('Faculty added successfully'),
  )
  @Post()
  create(@Body(ValidationPipe) body: FacultyDto) {
    return this.facultyService.create(body.name);
  }
}
