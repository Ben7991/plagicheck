import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SeederController } from './seeder.controller';
import { SeederService } from './seeder.service';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  controllers: [SeederController],
  providers: [SeederService],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class SeederModule {}
