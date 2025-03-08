import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeederService } from './seeder.service';

@Controller('seeders')
@ApiTags('Seeders')
export class SeederController {
  constructor(private seederService: SeederService) {}

  @Post('create-admin')
  createAdmin() {
    return this.seederService.createAdmin();
  }

  @Post('load-faculties')
  loadFaculties() {
    return this.seederService.loadFaculties();
  }
}
