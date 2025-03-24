import {
  PrimaryGeneratedColumn,
  Entity,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { DepartmentEntity } from './department.entity';

@Entity('students')
export class StudentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.students)
  @JoinColumn({ name: 'departmentId' })
  department: DepartmentEntity;
}
