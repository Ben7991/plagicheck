import { AlertProps } from '../../../components/molecules/alert/alert.util';
import { Department } from '../../../util/types/department.type';
import { Faculty } from '../../../util/types/faculty.type';

export type DepartmentListProps = {
  departments: Department[];
  onEdit: VoidFunction;
  onDelete: VoidFunction;
  onSelectDepartment: (item: Department) => void;
};

type EntityModalProps = {
  currentAction: 'add' | 'edit' | 'delete';
  onCancel: VoidFunction;
  onSetAlertInfo: (value: Omit<AlertProps, 'onHide'>) => void;
  onShowAlert: VoidFunction;
};

export type FacultyFormProps = EntityModalProps & {
  selectedFaculty?: Faculty;
};

export type DepartmentFormProps = EntityModalProps & {
  selectedDepartment?: Department;
  selectedFacultyId?: number;
};
