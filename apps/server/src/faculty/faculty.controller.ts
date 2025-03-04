import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseFilters,
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
  swaggerRemoveFaculty,
  swaggerUpdateFaculty,
} from './faculty.swagger';
import { FacultyEntity } from 'src/entities/faculty.entity';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';

@Controller('faculties')
@UseFilters(InternalServerErrorExceptionFilter)
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

  @ApiResponse(swaggerUpdateFaculty)
  @UseInterceptors(new DataMessageInterceptor('Faculty updated successfully'))
  @Put(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) body: FacultyDto) {
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid id');
    }

    return this.facultyService.update(+id, body.name);
  }

  @ApiResponse(swaggerRemoveFaculty)
  @Delete(':id')
  remove(@Param('id') id: string) {
    if (Number.isNaN(id)) {
      throw new BadRequestException('Invalid id');
    }

    return this.facultyService.remove(+id);
  }
}
