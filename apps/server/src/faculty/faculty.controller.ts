import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
import { AuthGuard } from 'src/auth/auth.guard';
import { AccessRole } from 'src/utils/decorators/acces-role.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('faculties')
@UseFilters(InternalServerErrorExceptionFilter)
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiQuery({ name: 'all', required: true })
  @ApiResponse(swaggerPaginateFaculty)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  findAll(
    @Query('all', ParseBoolPipe) all: boolean,
    @Query('page') page?: string,
    @Query('q') query?: string,
  ) {
    if (all) {
      return this.facultyService.findAll();
    }

    const parsedPage = !page ? 0 : parseInt(page);

    if (Number.isNaN(parsedPage)) {
      throw new BadRequestException('Invalid page number');
    }

    return this.facultyService.paginate(parsedPage, query ?? '');
  }

  @ApiResponse(swaggerCreateFaculty)
  @AccessRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new DataMessageInterceptor<FacultyEntity>('Faculty added successfully'),
  )
  @Post()
  create(@Body(ValidationPipe) body: FacultyDto) {
    return this.facultyService.create(body.name);
  }

  @ApiResponse(swaggerUpdateFaculty)
  @AccessRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseInterceptors(new DataMessageInterceptor('Faculty updated successfully'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) body: FacultyDto,
  ) {
    return this.facultyService.update(+id, body.name);
  }

  @ApiResponse(swaggerRemoveFaculty)
  @AccessRole(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.facultyService.remove(+id);
  }
}
