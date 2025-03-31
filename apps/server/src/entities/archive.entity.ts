import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { DocumentType } from 'src/utils/enums/document-type.enum';
import { DepartmentEntity } from './department.entity';

@Entity({ name: 'archives' })
export class ArchiveEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => DepartmentEntity, (department) => department.archives)
  @JoinColumn({ name: 'departmentId' })
  department: DepartmentEntity;

  @Column({
    type: 'varchar',
  })
  title: string;

  @Column({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  createdAt: Date;

  @Column({
    type: 'enum',
    enum: DocumentType,
    name: 'document_type',
  })
  documentType: DocumentType;

  @Column({
    type: 'varchar',
    name: 'file_path',
  })
  @Exclude()
  filePath: string;
}
