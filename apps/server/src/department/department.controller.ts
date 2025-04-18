import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

import { DepartmentService } from './department.service';
import { DepartmentDto } from './dto/department.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import {
  swaggerCreateDepartment,
  swaggerRemoveDepartment,
  swaggerUpdateDepartment,
} from './department.swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import { AccessRoles } from 'src/utils/decorators/acces-role.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseFilters(InternalServerErrorExceptionFilter)
@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @AccessRoles([Role.ADMIN, Role.LECTURER])
  @UseGuards(RolesGuard)
  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @ApiResponse(swaggerCreateDepartment)
  @AccessRoles([Role.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Department added successfully'))
  @Post()
  create(@Body(ValidationPipe) body: DepartmentDto) {
    return this.departmentService.create(body.name, +body.facultyId);
  }

  @ApiResponse(swaggerUpdateDepartment)
  @AccessRoles([Role.ADMIN])
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(
    new DataMessageInterceptor('Department updated successfully'),
  )
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body(ValidationPipe) body: DepartmentDto,
  ) {
    return this.departmentService.update(body.name, +body.facultyId, +id);
  }

  @ApiResponse(swaggerRemoveDepartment)
  @AccessRoles([Role.ADMIN])
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.departmentService.remove(+id);
  }
}
