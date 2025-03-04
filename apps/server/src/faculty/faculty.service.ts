import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Like } from 'typeorm';

import { AppLogger } from 'src/app.logger';
import { FacultyEntity } from 'src/entities/faculty.entity';
import { AvailabilityStatus } from 'src/utils/enums/availability-status.enum';

@Injectable()
export class FacultyService {
  private readonly appLogger = new AppLogger(FacultyService.name);
  private readonly rows = 9;

  constructor(private readonly dataSource: DataSource) {}

  async paginage(page: number, query: string) {
    try {
      const repo = this.dataSource.manager.getRepository(FacultyEntity);
      const count = await repo.count({
        where: {
          name: Like(`%${query}%`),
          status: AvailabilityStatus.AVAILABLE,
        },
      });
      const data = await repo.find({
        skip: page * this.rows,
        take: this.rows,
        where: {
          name: Like(`%${query}%`),
          status: AvailabilityStatus.AVAILABLE,
        },
      });

      return {
        count,
        data,
      };
    } catch (error) {
      this.appLogger.error(
        (error as Error).message,
        (error as Error).stack,
        `page=${page}`,
        `query=${query}`,
      );
      throw new InternalServerErrorException('Something went wrong');
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

      this.appLogger.error(
        (error as Error).message,
        (error as Error).stack,
        `name=${name}`,
      );
      throw new InternalServerErrorException('Something went wrong');
    }
  }
}
