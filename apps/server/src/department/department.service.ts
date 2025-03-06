import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, QueryFailedError } from 'typeorm';

import { DepartmentEntity } from 'src/entities/department.entity';
import { FacultyEntity } from 'src/entities/faculty.entity';
import { AvailabilityStatus } from 'src/utils/enums/availability-status.enum';

@Injectable()
export class DepartmentService {
  constructor(private readonly dataSource: DataSource) {}

  async create(name: string, facultyId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingFaculty = await this.dataSource.manager.findOneBy(
        FacultyEntity,
        {
          id: facultyId,
        },
      );

      if (
        !existingFaculty ||
        (existingFaculty &&
          existingFaculty.status === AvailabilityStatus.UN_AVAILABLE)
      ) {
        throw new BadRequestException('Faculty does not exist');
      }

      const department = new DepartmentEntity();
      department.name = name;
      department.faculty = existingFaculty;

      const savedDepartment = await queryRunner.manager.save(department);
      await queryRunner.commitTransaction();

      return savedDepartment;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      } else if (error instanceof QueryFailedError) {
        throw new BadRequestException('No duplicates are allowed');
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async update(name: string, facultyId: number, departmentId: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingDepartment = await this.dataSource.manager.findOneBy(
        DepartmentEntity,
        {
          id: departmentId,
        },
      );

      if (
        !existingDepartment ||
        (existingDepartment &&
          existingDepartment.status === AvailabilityStatus.UN_AVAILABLE)
      ) {
        throw new BadRequestException('Department does not exist');
      }

      const existingFaculty = await this.dataSource.manager.findOneBy(
        FacultyEntity,
        {
          id: facultyId,
        },
      );

      if (
        !existingFaculty ||
        (existingFaculty &&
          existingFaculty.status === AvailabilityStatus.UN_AVAILABLE)
      ) {
        throw new BadRequestException('Faculty does not exist');
      }

      existingDepartment.name = name;
      existingDepartment.faculty = existingFaculty;

      const updatedDepartment =
        await queryRunner.manager.save(existingDepartment);
      await queryRunner.commitTransaction();

      return updatedDepartment;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingDepartment = await this.dataSource.manager.findOneBy(
        DepartmentEntity,
        {
          id,
        },
      );

      if (!existingDepartment) {
        throw new BadRequestException('Department does not exist');
      }

      existingDepartment.status = AvailabilityStatus.UN_AVAILABLE;
      await queryRunner.manager.save(existingDepartment);
      await queryRunner.commitTransaction();

      return { message: 'Department removed successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
