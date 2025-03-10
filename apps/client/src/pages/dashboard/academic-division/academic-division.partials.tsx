import {
  FormEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  DepartmentFormProps,
  DepartmentListProps,
  FacultyFormProps,
} from './academic-division.types';
import { Faculty } from '../../../util/types/faculty.type';
import {
  createFaculty,
  academicDivisionSchema,
  getFaculties,
  createDepartment,
  updateFaculty,
  deleteFaculty,
  updateDepartment,
  getButtonText,
  isActionAddOrEdit,
  deleteDepartment,
} from './academic-division.utils';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';
import { useAppDispatch } from '../../../store/store.util';
import {
  addFaculty,
  updateFaculty as editFaculty,
  removeDepartment,
  addDepartment,
  updateDepartment as editDepartment,
  removeFaculty,
} from '../../../store/slice/faculty/faculty.slice';
import Button from '../../../components/atoms/button/Button';
import FormControl from '../../../components/atoms/form-elements/form-control/FormControl';
import FormFooter from '../../../components/atoms/form-elements/form-footer/FormFooter';
import FormGroup from '../../../components/atoms/form-elements/form-group/FormGroup';
import Label from '../../../components/atoms/form-elements/label/Label';
import MultiSelect from '../../../components/molecules/multi-select/MultiSelect';
import FormControlError from '../../../components/atoms/form-elements/form-control-error/FormControlError';
import TrashIcon from '../../../components/atoms/icons/TrashIcon';
import PencilIcon from '../../../components/atoms/icons/PencilIcon';

export function FacultyForm({
  currentAction,
  selectedFaculty,
  onCancel,
  onSetAlertInfo,
  onShowAlert,
}: FacultyFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<{ name: string }>({
    mode: 'onBlur',
    resolver: yupResolver(academicDivisionSchema),
  });

  useEffect(() => {
    if (selectedFaculty) {
      setValue('name', selectedFaculty.name);
    }
  }, [selectedFaculty, setValue]);

  const onSubmit: SubmitHandler<{ name: string }> = async (data) => {
    setIsLoading(true);
    let result;

    try {
      if (currentAction === 'add') {
        result = await createFaculty(data);
        dispatch(
          addFaculty({
            ...result.data,
            departments: [],
          }),
        );
      } else if (currentAction === 'edit' && selectedFaculty) {
        result = await updateFaculty(data, selectedFaculty.id);
        dispatch(
          editFaculty({
            ...result.data,
            departments: [],
          }),
        );
        onCancel();
      }
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      reset();
    } catch (error) {
      if ((error as Error).message === 'UN_AUTHORIZED') {
        return navigate('/');
      }
      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    onShowAlert();
  };

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFaculty) {
      return;
    }
    setIsLoading(true);

    try {
      const result = await deleteFaculty(selectedFaculty.id);
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      dispatch(removeFaculty(selectedFaculty.id));
    } catch (error) {
      if ((error as Error).message === 'UN_AUTHORIZED') {
        return navigate('/');
      }
      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    onShowAlert();
  };

  const isAddorEdit = isActionAddOrEdit(currentAction);
  const buttonText = getButtonText(currentAction);

  return (
    <form onSubmit={isAddorEdit ? handleSubmit(onSubmit) : handleDelete}>
      {isAddorEdit ? (
        <FormGroup className="mb-4">
          <Label htmlFor="faculty_name">Faculty name</Label>
          <FormControl
            type="text"
            id="faculty_name"
            placeholder="Enter faculty name here"
            autoComplete="on"
            hasError={!!errors.name}
            {...register('name')}
          />
          {errors.name && <FormControlError message={errors.name.message} />}
        </FormGroup>
      ) : (
        <p className="mb-4">
          Are you sure you want to delete this faculty? This action will remove
          all departments with this faculty, and it cannot be undone
        </p>
      )}
      <FormFooter className="gap-[19px]">
        <Button
          el="button"
          variant="secondary"
          className="flex-grow"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          el="button"
          variant={isAddorEdit ? 'primary' : 'danger'}
          className="flex-grow"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : buttonText}
        </Button>
      </FormFooter>
    </form>
  );
}

export function DepartmentForm({
  currentAction,
  selectedDepartment,
  selectedFacultyId,
  onCancel,
  onSetAlertInfo,
  onShowAlert,
}: DepartmentFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [multiSelectError, setMultiSelectError] = useState('');
  const [error, setError] = useState('');
  const [faculties, setFaculties] = useState<Omit<Faculty, 'departments'>[]>(
    [],
  );
  const [selectedFaculty, setSelectedFaculty] = useState<
    Omit<Faculty, 'departments'> | undefined
  >(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<{ name: string }>({
    mode: 'onBlur',
    resolver: yupResolver(academicDivisionSchema),
  });

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const result = await getFaculties(true);
        setFaculties(result.data);
      } catch (error) {
        setError('Something went wrong');
      }
    };

    fetchFaculties();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      setValue('name', selectedDepartment.name);
    }

    if (selectedFacultyId && faculties.length) {
      const facultyToEdit = faculties.find(
        (faculty) => faculty.id === selectedFacultyId,
      );
      setSelectedFaculty(facultyToEdit);
    }
  }, [selectedDepartment, setValue, faculties, selectedFacultyId]);

  const onSubmit: SubmitHandler<{ name: string }> = async (data) => {
    if (!selectedFaculty) {
      setMultiSelectError('Faculty is required');
      return;
    }

    setIsLoading(true);
    setMultiSelectError('');
    let result;

    try {
      if (currentAction === 'add') {
        result = await createDepartment({
          ...data,
          facultyId: selectedFaculty.id,
        });
        dispatch(
          addDepartment({
            department: result.data,
            facultyId: selectedFaculty.id,
          }),
        );
      } else if (
        currentAction === 'edit' &&
        selectedDepartment &&
        selectedFacultyId
      ) {
        result = await updateDepartment(
          {
            ...data,
            facultyId: selectedFaculty.id,
          },
          selectedDepartment.id,
        );
        dispatch(
          editDepartment({
            department: result.data,
            oldFacultyId: selectedFacultyId,
            chosenFacultyId: selectedFaculty.id,
          }),
        );
        onCancel();
      }
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      reset();
    } catch (error) {
      if ((error as Error).message === 'UN_AUTHORIZED') {
        return navigate('/');
      }

      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    onShowAlert();
  };

  const handleDelete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedDepartment || !selectedFacultyId) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteDepartment(selectedDepartment.id);
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      dispatch(
        removeDepartment({
          facultyId: selectedFacultyId,
          departmentId: selectedDepartment.id,
        }),
      );
    } catch (error) {
      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    onShowAlert();
  };

  if (error) {
    return <p>{error}</p>;
  }

  const isAddorEdit = isActionAddOrEdit(currentAction);
  const buttonText = getButtonText(currentAction);

  return (
    <form onSubmit={isAddorEdit ? handleSubmit(onSubmit) : handleDelete}>
      {isAddorEdit ? (
        <>
          <FormGroup className="mb-4">
            <Label htmlFor="department_name">Department name</Label>
            <FormControl
              type="text"
              id="department_name"
              placeholder="Enter department name here"
              autoComplete="on"
              hasError={!!errors.name}
              {...register('name')}
            />
            {errors.name && <FormControlError message={errors.name.message} />}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="select_faculty">Select faculty</Label>
            <MultiSelect
              list={faculties}
              onSelectItem={setSelectedFaculty}
              selectedItem={selectedFaculty}
            />
            {multiSelectError && (
              <FormControlError message={multiSelectError} />
            )}
          </FormGroup>
        </>
      ) : (
        <p className="mb-4">
          Are you sure you want to delete this department? This action will
          remove the department, and it cannot be undone
        </p>
      )}
      <FormFooter className="gap-[19px]">
        <Button
          el="button"
          variant="secondary"
          className="flex-grow"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          el="button"
          variant={isAddorEdit ? 'primary' : 'danger'}
          className="flex-grow"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : buttonText}
        </Button>
      </FormFooter>
    </form>
  );
}

export const DepartmentList = forwardRef<
  { onHide: VoidFunction },
  DepartmentListProps
>(({ departments, onEdit, onDelete, onSelectDepartment }, ref) => {
  const [show, setShow] = useState(false);

  useImperativeHandle(ref, () => ({
    onHide: () => setShow(false),
  }));

  let buttonText = '';

  if (departments.length <= 2) {
    buttonText = departments.length.toString();
  } else {
    buttonText = `+${departments.length - 2}`;
  }

  const list: JSX.Element[] = [];

  if (departments.length > 0) {
    for (let i = 0; i < 2; i++) {
      list.push(
        <span
          key={departments[i].id}
          className="rounded-lg py-2 px-3 bg-[var(--gray-1000)] block md:inline-block lg:mr-2 mb-2 md:mb-0 opacity-70"
        >
          {departments[i].name}
        </span>,
      );
    }
  }

  return (
    <div className="relative inline-block">
      {list}
      {departments.length > 0 && (
        <button
          className="border-2 border-[var(--gray-1000)] rounded-lg inline-block p-2 hover:bg-[var(--gray-1000)] cursor-pointer opacity-70"
          onClick={() => setShow(!show)}
        >
          {buttonText}
        </button>
      )}
      {show && (
        <ul className="absolute right-0 top-12 bg-white border border-[var(--gray-1000)] rounded-lg shadow-xl w-[315px] p-2 md:p-4 z-[2] space-y-2">
          {departments.map((department) => (
            <li
              className="flex items-center justify-between"
              key={department.id}
            >
              {department.name.length > 24 ? (
                <span title={department.name}>
                  {department.name.substring(0, 24)}...
                </span>
              ) : (
                <span>{department.name}</span>
              )}
              <p className="space-x-2">
                <button
                  className="hover:cursor-pointer"
                  onClick={() => {
                    onEdit();
                    onSelectDepartment(department);
                  }}
                >
                  <PencilIcon />
                </button>
                <button
                  className="hover:cursor-pointer"
                  onClick={() => {
                    onDelete();
                    onSelectDepartment(department);
                  }}
                >
                  <TrashIcon />
                </button>
              </p>
            </li>
          ))}
        </ul>
      )}
      {departments.length === 0 && (
        <span className="p-2 invisible inline-block">Nothing</span>
      )}
    </div>
  );
});
