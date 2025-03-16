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

import { StudentService } from './student.service';
import { StudentDto } from './dto/student.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import {
  swaggerCreateStudent,
  swaggerPaginateStudent,
  swaggerRemoveStudent,
  swaggerUpdateStudent,
} from './student.swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AccessRole } from 'src/utils/decorators/acces-role.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseFilters(InternalServerErrorExceptionFilter)
@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse(swaggerPaginateStudent)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  paginate(@Query('page') page?: string, @Query('q') query?: string) {
    const parsedPage = !page ? 0 : parseInt(page);

    if (Number.isNaN(parsedPage)) {
      throw new BadRequestException('Invalid page number');
    }

    return this.studentService.paginate(parsedPage, query ?? '');
  }

  @ApiResponse(swaggerCreateStudent)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Student added successfully'))
  @AccessRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body(ValidationPipe) body: StudentDto) {
    return this.studentService.create(body);
  }

  @ApiResponse(swaggerUpdateStudent)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Student updated successfully'))
  @AccessRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) body: StudentDto) {
    return this.studentService.update(body, id);
  }

  @ApiResponse(swaggerRemoveStudent)
  @AccessRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
