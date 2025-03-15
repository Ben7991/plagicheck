import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FacultyEntity } from './faculty.entity';
import { AvailabilityStatus } from 'src/utils/enums/availability-status.enum';
import { Exclude } from 'class-transformer';
import { LecturerEntity } from './lecturer.entity';

@Entity('departments')
export class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    length: 100,
    unique: true,
  })
  name: string;

  @ManyToOne(() => FacultyEntity, (faculty) => faculty.departments)
  @JoinColumn({
    name: 'faculty_id',
  })
  faculty: FacultyEntity;

  @Column('enum', {
    enum: AvailabilityStatus,
    default: AvailabilityStatus.AVAILABLE,
  })
  @Exclude()
  status: AvailabilityStatus;

  @OneToMany(() => LecturerEntity, (lecturer) => lecturer.department)
  lecturers: LecturerEntity[];
}
