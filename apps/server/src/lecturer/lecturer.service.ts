import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { hash } from 'bcryptjs';

import { LecturerDto } from './dto/lecturer.dto';
import { UserEntity } from 'src/entities/user.entity';
import { Role } from 'src/utils/enums/role.enum';
import { LecturerEntity } from 'src/entities/lecturer.entity';
import { DepartmentEntity } from 'src/entities/department.entity';
import { UsersRepository } from 'src/users/users.repository';
import { INVITATION } from 'src/mailer/event-identifies';
import { TextGenerator } from 'src/utils/text-generator.util';

@Injectable()
export class LecturerService {
  private userRepo: UsersRepository;

  constructor(
    private readonly dataSource: DataSource,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.userRepo = new UsersRepository(dataSource);
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

      const existingDepartment = await queryRunner.manager.findOneBy(
        DepartmentEntity,
        {
          id: body.departmentId,
        },
      );

      if (!existingDepartment) {
        throw new BadRequestException('Department does not exist');
      }

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
}
