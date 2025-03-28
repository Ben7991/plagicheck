import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource, QueryRunner } from 'typeorm';
import { hash } from 'bcryptjs';

import { LecturerDto } from './dto/lecturer.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/utils/enums/role.enum';
import { LecturerEntity } from 'src/entities/lecturer.entity';
import { DepartmentEntity } from 'src/entities/department.entity';
import { UsersRepository } from 'src/users/users.repository';
import { INVITATION } from 'src/mailer/event-identifies';
import { TextGenerator } from 'src/utils/text-generator.util';
import { AccountStatus } from 'src/utils/enums/account-status.enum';

@Injectable()
export class LecturerService {
  private userRepo: UsersRepository;
  private readonly rows = 9;

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.userRepo = new UsersRepository(dataSource);
  }

  async paginate(page: number, query: string) {
    try {
      const count = await this.dataSource.manager
        .getRepository(LecturerEntity)
        .createQueryBuilder('lecturers')
        .innerJoinAndSelect(
          'lecturers.user',
          'users',
          'users.account_status=:status',
          { status: AccountStatus.ACTIVE },
        )
        .where('users.name LIKE :name OR users.email LIKE :email', {
          name: `%${query}%`,
          email: `%${query}%`,
        })
        .getCount();
      const lecturers = await this.dataSource.manager
        .getRepository(LecturerEntity)
        .createQueryBuilder('lecturers')
        .innerJoinAndSelect(
          'lecturers.user',
          'users',
          'users.account_status=:status',
          { status: AccountStatus.ACTIVE },
        )
        .innerJoinAndSelect('lecturers.department', 'departments')
        .where('users.name LIKE :name OR users.email LIKE :email', {
          name: `%${query}%`,
          email: `%${query}%`,
        })
        .take(this.rows)
        .skip(page * this.rows)
        .orderBy('lecturers.id', 'DESC')
        .getMany();

      return { count, data: lecturers };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async create(body: LecturerDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingUser = await this.userRepo.find(body.email);
      if (existingUser) {
        throw new BadRequestException('Email already taken');
      }

      const existingDepartment = await this._getDepartment(
        body.departmentId,
        queryRunner,
      );

      const generatedText = TextGenerator.generator();

      const user = new UserEntity();
      user.name = body.name;
      user.role = Role.LECTURER;
      user.email = body.email;
      user.phone = body.phoneNumber;
      const saltRound = 12;
      user.password = await hash(generatedText, saltRound);
      user.id = await this.userRepo.getNextId(user.role);

      const savedUser = await queryRunner.manager.save(user);

      const lecturer = new LecturerEntity();
      lecturer.qualification = body.qualification;
      lecturer.department = existingDepartment;
      lecturer.user = savedUser;

      const savedLecturer = await queryRunner.manager.save(lecturer);
      await queryRunner.commitTransaction();

      this.eventEmitter.emit(INVITATION, {
        id: savedLecturer.user.id,
        role: savedLecturer.user.role,
        email: savedLecturer.user.email,
        password: generatedText,
        name: savedLecturer.user.name,
      });

      return savedLecturer;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async _getDepartment(departmentId: number, queryRunner: QueryRunner) {
    const existingDepartment = await queryRunner.manager.findOneBy(
      DepartmentEntity,
      {
        id: departmentId,
      },
    );

    if (!existingDepartment) {
      throw new BadRequestException('Department does not exist');
    }

    return existingDepartment;
  }

  async update(body: LecturerDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingUserById = await this.userRepo.find(userId);
      const existingUserByEmail = await this.userRepo.find(body.email);

      if (!existingUserById) {
        throw new BadRequestException('Lecturer to update is not recognized');
      }

      if (
        existingUserByEmail &&
        existingUserByEmail.id !== existingUserById.id
      ) {
        throw new BadRequestException('Email address is already taken');
      }

      const existingDepartment = await this._getDepartment(
        body.departmentId,
        queryRunner,
      );

      const existingLecturer = await queryRunner.manager.findOneBy(
        LecturerEntity,
        {
          user: existingUserById,
        },
      );

      if (!existingLecturer) {
        throw new BadRequestException('Lecturer to update is not recognized');
      }

      const oldEmail = existingUserById.email;
      const newEmail = body.email;
      const generatedText = TextGenerator.generator();

      if (oldEmail !== newEmail) {
        const saltRound = 12;
        existingUserById.password = await hash(generatedText, saltRound);
      }

      existingUserById.name = body.name;
      existingUserById.email = body.email;
      existingUserById.phone = body.phoneNumber;

      const savedUser = await queryRunner.manager.save(existingUserById);

      existingLecturer.qualification = body.qualification;
      existingLecturer.department = existingDepartment;
      existingLecturer.user = savedUser;
      const savedLecturer = await queryRunner.manager.save(existingLecturer);

      await queryRunner.commitTransaction();

      if (oldEmail !== newEmail) {
        this.eventEmitter.emit(INVITATION, {
          id: savedLecturer.user.id,
          role: savedLecturer.user.role,
          email: savedLecturer.user.email,
          password: generatedText,
          name: savedLecturer.user.name,
        });
      }

      return savedLecturer;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async remove(userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingLecturer = await queryRunner.manager.findOneBy(UserEntity, {
        id: userId,
      });

      if (!existingLecturer) {
        throw new BadRequestException('Lecturer to delete does not exist');
      }

      existingLecturer.accountStatus = AccountStatus.SUSPENDED;
      await queryRunner.manager.save(existingLecturer);
      await queryRunner.commitTransaction();

      return { message: 'Lecturer removed successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
