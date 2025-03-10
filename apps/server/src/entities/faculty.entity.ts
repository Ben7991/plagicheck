import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { AvailabilityStatus } from 'src/utils/enums/availability-status.enum';
import { Exclude } from 'class-transformer';
import { DepartmentEntity } from './department.entity';

@Entity('faculties')
export class FacultyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', {
    unique: true,
  })
  name: string;

  @Column('enum', {
    enum: AvailabilityStatus,
    default: AvailabilityStatus.AVAILABLE,
  })
  @Exclude()
  status: AvailabilityStatus;

  @OneToMany(() => DepartmentEntity, (department) => department.faculty)
  departments: DepartmentEntity[];
}
