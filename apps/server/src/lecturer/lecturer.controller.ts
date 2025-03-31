import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { LecturerService } from './lecturer.service';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import { LecturerDto } from './dto/lecturer.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import {
  swaggerCreateLecturer,
  swaggerPaginateLecturer,
  swaggerRemoveLecturer,
  swaggerUpdateLecturer,
} from './lecturer.swagger';
import { Role } from 'src/utils/enums/role.enum';
import { AccessRoles } from 'src/utils/decorators/acces-role.decorator';
import { RolesGuard } from 'src/utils/guards/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
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
  @AccessRoles([Role.ADMIN])
  @UseGuards(RolesGuard)
  @Post()
  create(@Body(ValidationPipe) body: LecturerDto) {
    return this.lecturerService.create(body);
  }

  @ApiResponse(swaggerUpdateLecturer)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Lecturer updated successfully'))
  @AccessRoles([Role.ADMIN])
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) body: LecturerDto) {
    return this.lecturerService.update(body, id);
  }

  @ApiResponse(swaggerRemoveLecturer)
  @AccessRoles([Role.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lecturerService.remove(id);
  }
}
