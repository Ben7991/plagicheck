import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

import { UserEntity } from 'src/entities/user.entity';
import { FacultyEntity } from 'src/entities/faculty.entity';

import facultyData from './data/faculty.data';

@Injectable()
export class SeederService {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {}

  async createAdmin() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const adminDetails = this.configService.get<{
        id: string;
        name: string;
        email: string;
        password: string;
        phone: string;
      }>('admin');
      const existingAdmin = await this.dataSource.manager.findOne(UserEntity, {
        where: {
          email: adminDetails?.email,
        },
      });

      if (existingAdmin) {
        throw new Error('Admin already created');
      }

      const saltRound = 10;
      const hashedPassword = await bcryptjs.hash(
        adminDetails!.password,
        saltRound,
      );

      const admin = new UserEntity();
      admin.id = adminDetails!.id;
      admin.name = adminDetails!.name;
      admin.email = adminDetails!.email;
      admin.password = hashedPassword;
      admin.phone = adminDetails!.phone;

      await queryRunner.manager.save(admin);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return { message: 'Admin created successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      throw new BadRequestException((error as Error).message);
    }
  }

  async loadFaculties() {
    try {
      for (const name of facultyData) {
        const faculty = new FacultyEntity();
        faculty.name = name;
        await this.dataSource.manager.save(faculty);
      }

      return { message: 'Loaded faculties successfully' };
    } catch {
      throw new BadRequestException('Already loaded faculties');
    }
  }
}
