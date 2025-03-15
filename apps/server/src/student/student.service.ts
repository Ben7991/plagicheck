import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Like, QueryRunner } from 'typeorm';
import { hash } from 'bcryptjs';

import { StudentDto } from './dto/student.dto';
import { UsersRepository } from 'src/users/users.repository';
import { DepartmentEntity } from 'src/entities/department.entity';
import { TextGenerator } from 'src/utils/text-generator.util';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/utils/enums/role.enum';
import { StudentEntity } from 'src/entities/student.entity';
import { AccountStatus } from 'src/utils/enums/account-status.enum';
import { INVITATION } from 'src/mailer/event-identifies';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StudentService {
  private readonly userRepo: UsersRepository;
  private readonly rows = 9;

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.userRepo = new UsersRepository(this.dataSource);
  }

  async paginate(page: number, query: string) {
    try {
      const count = await this.dataSource.manager.count(UserEntity, {
        where: {
          role: Role.LECTURER,
          accountStatus: AccountStatus.ACTIVE,
          name: Like(`%${query}%`),
          email: Like(`%${query}%`),
        },
      });
      const lecturers = await this.dataSource.manager.find(StudentEntity, {
        skip: this.rows * page,
        take: this.rows,
        relations: {
          user: true,
          department: true,
        },
        where: {
          user: {
            accountStatus: AccountStatus.ACTIVE,
            name: Like(`%${query}%`),
            email: Like(`%${query}%`),
          },
        },
      });

      return { count, data: lecturers };
    } catch (error) {
      throw new InternalServerErrorException((error as Error).message);
    }
  }

  async create(body: StudentDto) {
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
      user.role = Role.STUDENT;
      user.email = body.email;
      user.phone = body.phoneNumber;
      const saltRound = 12;
      user.password = await hash(generatedText, saltRound);
      user.id = await this.userRepo.getNextId(user.role);

      const savedUser = await queryRunner.manager.save(user);

      const student = new StudentEntity();
      student.department = existingDepartment;
      student.user = savedUser;
      const savedStudent = await queryRunner.manager.save(student);
      await queryRunner.commitTransaction();

      return savedStudent;
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

  async update(body: StudentDto, userId: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    await queryRunner.connect();

    try {
      const existingUserById = await this.userRepo.find(userId);
      const existingUserByEmail = await this.userRepo.find(body.email);

      if (!existingUserById) {
        throw new BadRequestException('Student to update is not recognized');
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

      const existingStudent = await queryRunner.manager.findOneBy(
        StudentEntity,
        {
          user: existingUserById,
        },
      );

      if (!existingStudent) {
        throw new BadRequestException('Student to update is not recognized');
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

      existingStudent.department = existingDepartment;
      existingStudent.user = savedUser;
      const savedLecturer = await queryRunner.manager.save(existingStudent);

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
      const existingStudent = await queryRunner.manager.findOneBy(UserEntity, {
        id: userId,
      });

      if (!existingStudent) {
        throw new BadRequestException('Student to delete does not exist');
      }

      existingStudent.accountStatus = AccountStatus.SUSPENDED;
      await queryRunner.manager.save(existingStudent);
      await queryRunner.commitTransaction();

      return { message: 'Student removed successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction();

      if (error instanceof BadRequestException) {
        throw new BadRequestException((error as Error).message);
      }

      throw new InternalServerErrorException((error as Error).message);
    }
  }
}
