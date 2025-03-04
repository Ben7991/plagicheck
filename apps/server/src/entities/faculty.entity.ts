import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { AvailabilityStatus } from 'src/utils/enums/availability-status.enum';
import { Exclude } from 'class-transformer';

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
}
