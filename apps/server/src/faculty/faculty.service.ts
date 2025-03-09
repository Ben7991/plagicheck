import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Like } from 'typeorm';

import { FacultyEntity } from 'src/entities/faculty.entity';
import { AvailabilityStatus } from 'src/utils/enums/availability-status.enum';

@Injectable()
export class FacultyService {
  private readonly rows = 9;

  constructor(private readonly dataSource: DataSource) {}

  async findAll() {
    try {
      const data = await this.dataSource.manager.find(FacultyEntity, {
        where: {
          status: AvailabilityStatus.AVAILABLE,
        },
        order: {
          name: 'ASC',
        },
      });

      return { data };
    } catch {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async paginate(page: number, query: string) {
    try {
      const repo = this.dataSource.manager.getRepository(FacultyEntity);
      const count = await repo.count({
        where: {
          name: Like(`%${query}%`),
          status: AvailabilityStatus.AVAILABLE,
        },
      });
      const data = await repo.find({
        relations: {
          departments: true,
        },
        skip: page * this.rows,
        take: this.rows,
        where: {
          name: Like(`%${query}%`),
          status: AvailabilityStatus.AVAILABLE,
        },
        order: {
          id: 'DESC',
        },
      });

      for (const row of data) {
        row.departments = row.departments.filter(
          (item) => item.status === AvailabilityStatus.AVAILABLE,
        );
      }

      return {
        count,
        data,
      };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async create(name: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingFaculty = await queryRunner.manager.findOneBy('faculties', {
        name: Like(`%${name}%`),
      });

      if (existingFaculty) {
        throw new BadRequestException('Faculty already exist');
      }

      const faculty = new FacultyEntity();
      faculty.name = name;

      const result = await queryRunner.manager.save(faculty);
      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async update(id: number, name: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingFaculty = await this.dataSource.manager.findOneBy(
        FacultyEntity,
        { id },
      );

      if (!existingFaculty) {
        throw new BadRequestException('Faculty does not exist');
      }

      existingFaculty.name = name;
      const updatedFaculty = await queryRunner.manager.save(existingFaculty);
      await queryRunner.commitTransaction();

      return updatedFaculty;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  async remove(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingFaculty = await this.dataSource.manager.findOneBy(
        FacultyEntity,
        { id },
      );

      if (!existingFaculty) {
        throw new BadRequestException('Faculty does not exist');
      }

      existingFaculty.status = AvailabilityStatus.UN_AVAILABLE;
      await queryRunner.manager.save(existingFaculty);
      await queryRunner.commitTransaction();

      return { message: 'Faculty removed successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }
      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
