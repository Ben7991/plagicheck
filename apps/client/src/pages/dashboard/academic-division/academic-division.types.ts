import { Department } from '@util/types/department.type';
import { Faculty } from '@util/types/faculty.type';
import { ModalFormProps } from '@util/types/modal-form.type';

export type DepartmentListProps = {
  departments: Department[];
  onEdit: VoidFunction;
  onDelete: VoidFunction;
  onSelectDepartment: (item: Department) => void;
};

export type FacultyFormProps = ModalFormProps & {
  selectedFaculty?: Faculty;
};

export type DepartmentFormProps = ModalFormProps & {
  selectedDepartment?: Department;
  selectedFacultyId?: number;
};
