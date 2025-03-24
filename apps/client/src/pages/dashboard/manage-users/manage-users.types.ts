import { ReactNode } from 'react';

import { Department } from '@util/types/department.type';
import { ModalFormProps } from '@util/types/modal-form.type';
import { Lecturer, Student } from '@util/types/user.type';

export type SubHeaderProps = {
  currentTab: string;
  children: ReactNode;
};

export type BulkUploadProps = {
  currentTab: string;
};

export type LecturerFormInputs = {
  name: string;
  email: string;
  phoneNumber: string;
  qualification: string;
};

export type StudentFormInputs = {
  name: string;
  email: string;
  phoneNumber: string;
};

type FormProps = {
  departments: Department[];
};

export type LecturerFormProps = FormProps &
  ModalFormProps & {
    selectedLecturer?: Lecturer;
    onDeSelectLecturer: VoidFunction;
  };

export type StudentFormProps = FormProps &
  ModalFormProps & {
    selectedStudent?: Student;
    onDeSelectStudent: VoidFunction;
  };
