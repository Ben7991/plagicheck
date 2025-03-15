import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from './user.entity';
import { DepartmentEntity } from './department.entity';

@Entity('lecturers')
export class LecturerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column('varchar', { length: 100 })
  qualification: string;

  @ManyToOne(() => DepartmentEntity, (department) => department.lecturers)
  @JoinColumn({ name: 'departmentId' })
  department: DepartmentEntity;
}
