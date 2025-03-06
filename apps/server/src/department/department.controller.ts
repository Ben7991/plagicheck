import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { DepartmentService } from './department.service';
import { DepartmentDto } from './dto/department.dto';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import {
  swaggerCreateDepartment,
  swaggerRemoveDepartment,
  swaggerUpdateDepartment,
} from './department.swagger';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @ApiResponse(swaggerCreateDepartment)
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Department added successfully'))
  @Post()
  create(@Body(ValidationPipe) body: DepartmentDto) {
    return this.departmentService.create(body.name, +body.facultyId);
  }

  @ApiResponse(swaggerUpdateDepartment)
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
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.departmentService.remove(+id);
  }
}
