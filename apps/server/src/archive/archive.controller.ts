import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  StreamableFile,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArchiveService } from './archive.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArchiveDto } from './dto/create-archive.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

import { archiveMulterOptions } from './archive.util';
import { DataMessageInterceptor } from 'src/utils/interceptors/data-message.interceptor';
import {
  swaggerCreateArchive,
  swaggerPaginateArchive,
  swaggerRemoveArchive,
} from './archive.swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { InternalServerErrorExceptionFilter } from 'src/internal-server-error-exception.filter';
import { AccessRoles } from 'src/utils/decorators/acces-role.decorator';
import { Role } from 'src/utils/enums/role.enum';
import { RolesGuard } from 'src/utils/guards/roles.guard';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@UseGuards(AuthGuard)
@UseFilters(InternalServerErrorExceptionFilter)
@Controller('archives')
export class ArchiveController {
  constructor(private readonly archiveService: ArchiveService) {}

  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse(swaggerPaginateArchive)
  @UseInterceptors(ClassSerializerInterceptor)
  @AccessRoles([Role.ADMIN, Role.LECTURER])
  @Get()
  paginate(@Query('page') page?: string, @Query('q') query?: string) {
    const parsedPage = !page ? 0 : parseInt(page);

    if (Number.isNaN(parsedPage)) {
      throw new BadRequestException('Invalid page number');
    }

    return this.archiveService.paginate(parsedPage, query ?? '');
  }

  @ApiConsumes('multipart/form-data')
  @ApiResponse(swaggerCreateArchive)
  @UseInterceptors(FileInterceptor('file', archiveMulterOptions))
  @UseInterceptors(ClassSerializerInterceptor)
  @UseInterceptors(new DataMessageInterceptor('Archive added successfully'))
  @AccessRoles([Role.ADMIN, Role.LECTURER])
  @Post()
  create(
    @Body() body: CreateArchiveDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1 * 1024 * 1024,
            message: 'File must be 1 megabyte in size or less',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.archiveService.create(file, +body.departmentId);
  }

  @ApiResponse(swaggerRemoveArchive)
  @AccessRoles([Role.ADMIN, Role.LECTURER])
  @Delete(':id')
  remove(@Param('id') id: string) {
    const parsedId = parseInt(id);

    if (Number.isNaN(parsedId)) {
      throw new BadRequestException('Archive to delete is not recognized');
    }

    return this.archiveService.remove(+id);
  }

  @AccessRoles([Role.ADMIN, Role.LECTURER])
  @Get(':id/download')
  async download(@Param('id') id: string) {
    const parsedId = parseInt(id);

    if (Number.isNaN(parsedId)) {
      throw new BadRequestException('Archive to delete is not recognized');
    }

    const file = await this.archiveService.getFilePathToDownload(+id);
    return new StreamableFile(file);
  }
}
