import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  BulkUploadProps,
  LecturerFormInputs,
  LecturerFormProps,
  StudentFormInputs,
  StudentFormProps,
  SubHeaderProps,
} from './manage-users.types';
import {
  createUser,
  deleteUser,
  isActiveTabLecturer,
  isActiveTabStudent,
  lecturerSchema,
  MANAGE_USERS_ROOT_PATH,
  studentSchema,
  updateUser,
} from './manage-users.util';
import FormGroup from '@components/atoms/form-elements/form-group/FormGroup';
import Label from '@components/atoms/form-elements/label/Label';
import FormControl from '@components/atoms/form-elements/form-control/FormControl';
import FormFooter from '@components/atoms/form-elements/form-footer/FormFooter';
import Button from '@components/atoms/button/Button';
import SubPageHeader from '@components/organisms/page-header/SubPageHeader';
import MainContent from '@components/atoms/main-content/MainContent';
import Headline from '@components/atoms/headline/Headline';
import { Department } from '@util/types/department.type';
import MultiSelect from '@components/molecules/multi-select/MultiSelect';
import FormControlError from '@components/atoms/form-elements/form-control-error/FormControlError';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppDispatch } from '@store/store.util';
import {
  addLecturer,
  removeLecturer,
  updateLecturer,
} from '@store/slice/lecturer/lecturer.slice';
import { AlertVariant } from '@util/enum/alert-variant.enum';
import { getButtonText, isActionAddOrEdit } from '@util/action-handler.util';
import {
  addStudent,
  removeStudent,
  updateStudent,
} from '@store/slice/student/student.slice';
import GoBack from '@components/molecules/go-back/GoBack';

export function SubHeader({ currentTab, children }: SubHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0 md:items-center py-3 px-4 md:py-4 md:px-5 xl:px-[41px] border-b border-b-[var(--gray-700)] mt-18 md:mt-20 lg:mt-0">
      <div className="flex gap-4">
        <Link
          className={`border-b-2 border-b-transparent inline-block py-2 px-3 lg:px-4 ${isActiveTabLecturer(currentTab) && 'text-[var(--sea-blue-100)] border-b-[var(--sea-blue-100)!important] bg-[var(--gray-1000)]'}`}
          to={`${MANAGE_USERS_ROOT_PATH}?tab=lecturer`}
        >
          Lecturers
        </Link>
        <Link
          className={`border-b-2 border-b-transparent inline-block py-2 px-3 lg:px-4 ${isActiveTabStudent(currentTab) && 'text-[var(--sea-blue-100)] border-b-[var(--sea-blue-100)!important] bg-[var(--gray-1000)]'}`}
          to={`${MANAGE_USERS_ROOT_PATH}?tab=student`}
        >
          Students
        </Link>
      </div>
      <div className="flex gap-4">{children}</div>
    </div>
  );
}

export function LecturerForm({
  departments,
  currentAction,
  selectedLecturer,
  onCancel,
  onSetAlertInfo,
  onShowAlert,
  onDeSelectLecturer,
}: LecturerFormProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [multiSelectError, setMultiSelectError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<LecturerFormInputs>({
    mode: 'onBlur',
    resolver: yupResolver(lecturerSchema),
  });

  useEffect(() => {
    if (selectedLecturer) {
      setSelectedDepartment(selectedLecturer.department);
      setValue('name', selectedLecturer.user.name);
      setValue('email', selectedLecturer.user.email);
      setValue('phoneNumber', selectedLecturer.user.phone);
      setValue('qualification', selectedLecturer.qualification);
    }
  }, [selectedLecturer, setSelectedDepartment, setValue]);

  const onSubmit: SubmitHandler<LecturerFormInputs> = async (data) => {
    if (!selectedDepartment) {
      setMultiSelectError('Department is required');
      return;
    }

    let result;
    setIsLoading(true);

    try {
      if (currentAction === 'add') {
        result = await createUser(
          {
            ...data,
            departmentId: selectedDepartment.id,
          },
          'lecturers',
        );
        dispatch(addLecturer(result.data));
        setSelectedDepartment(undefined);
      } else if (currentAction === 'edit' && selectedLecturer) {
        result = await updateUser(
          {
            ...data,
            departmentId: selectedDepartment.id,
          },
          selectedLecturer.user.id,
          'lecturers',
        );
        onCancel();
        dispatch(updateLecturer(result.data));
        onDeSelectLecturer();
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

    onShowAlert();
    setIsLoading(false);
  };

  const handleDeleteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedLecturer) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteUser(selectedLecturer.user.id, 'lecturers');
      dispatch(removeLecturer(selectedLecturer.id));
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      onDeSelectLecturer();
      onCancel();
    } catch (error) {
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
    <form onSubmit={isAddorEdit ? handleSubmit(onSubmit) : handleDeleteSubmit}>
      {isAddorEdit ? (
        <>
          <FormGroup className="mb-4">
            <Label htmlFor="name">Name</Label>
            <FormControl
              type="text"
              id="name"
              placeholder="Enter first and last name here"
              {...register('name')}
              hasError={!!errors.name}
            />
            {errors.name && <FormControlError message={errors.name.message} />}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="email">Email address</Label>
            <FormControl
              type="email"
              id="email"
              placeholder="Eg. johndoe@gmail.com"
              {...register('email')}
              hasError={!!errors.email}
            />
            {errors.email && (
              <FormControlError message={errors.email.message} />
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="phone">Phone number</Label>
            <FormControl
              type="text"
              id="phone"
              placeholder="Enter phone number here"
              {...register('phoneNumber')}
              hasError={!!errors.phoneNumber}
            />
            {errors.phoneNumber && (
              <FormControlError message={errors.phoneNumber.message} />
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="department">Department</Label>
            <MultiSelect
              placeholderText="Select department"
              list={departments}
              onSelectItem={setSelectedDepartment}
              selectedItem={selectedDepartment}
            />
            {multiSelectError && (
              <FormControlError message={multiSelectError} />
            )}
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="qualification">Qualification</Label>
            <FormControl
              type="text"
              id="qualification"
              placeholder="Enter qualification here"
              {...register('qualification')}
              hasError={!!errors.qualification}
            />
            {errors.qualification && (
              <FormControlError message={errors.qualification.message} />
            )}
          </FormGroup>
        </>
      ) : (
        <p className="mb-4">
          Are you sure you want to delete{' '}
          <strong>{selectedLecturer?.user.name}</strong>? Please remember that
          this action cannot be undone
        </p>
      )}
      <FormFooter className="gap-4">
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

export function StudentForm({
  departments,
  currentAction,
  selectedStudent,
  onCancel,
  onSetAlertInfo,
  onShowAlert,
  onDeSelectStudent,
}: StudentFormProps) {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department>();
  const [multiSelectError, setMultiSelectError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<StudentFormInputs>({
    mode: 'onBlur',
    resolver: yupResolver(studentSchema),
  });

  console.log(errors);

  useEffect(() => {
    if (selectedStudent) {
      setSelectedDepartment(selectedStudent.department);
      setValue('name', selectedStudent.user.name);
      setValue('email', selectedStudent.user.email);
      setValue('phoneNumber', selectedStudent.user.phone);
    }
  }, [selectedStudent, setSelectedDepartment, setValue]);

  const onSubmit: SubmitHandler<StudentFormInputs> = async (data) => {
    if (!selectedDepartment) {
      setMultiSelectError('Department is required');
      return;
    }

    setIsLoading(true);
    let result;

    try {
      if (currentAction === 'add') {
        result = await createUser(
          {
            ...data,
            departmentId: selectedDepartment.id,
          },
          'students',
        );
        dispatch(addStudent(result.data));
        setSelectedDepartment(undefined);
      } else if (currentAction === 'edit' && selectedStudent) {
        result = await updateUser(
          {
            ...data,
            departmentId: selectedDepartment.id,
          },
          selectedStudent.user.id,
          'students',
        );
        onCancel();
        dispatch(updateStudent(result.data));
        onDeSelectStudent();
      }
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      reset();
    } catch (error) {
      onSetAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
    }

    setIsLoading(false);
    onShowAlert();
  };

  const handleDeleteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedStudent) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteUser(selectedStudent.user.id, 'students');
      dispatch(removeStudent(selectedStudent.id));
      onSetAlertInfo({
        message: result.message,
        variant: AlertVariant.SUCCESS,
      });
      onDeSelectStudent();
      onCancel();
    } catch (error) {
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
    <form onSubmit={isAddorEdit ? handleSubmit(onSubmit) : handleDeleteSubmit}>
      {isAddorEdit ? (
        <>
          <FormGroup className="mb-4">
            <Label htmlFor="name">Name</Label>
            <FormControl
              type="text"
              id="name"
              placeholder="Enter first and last name here"
              {...register('name')}
              hasError={!!errors.name}
            />
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="email">Email address</Label>
            <FormControl
              type="email"
              id="email"
              placeholder="Eg. johndoe@gmail.com"
              {...register('email')}
              hasError={!!errors.email}
            />
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="phoneNumber">Phone number</Label>
            <FormControl
              type="text"
              id="phoneNumber"
              placeholder="Enter phone number here"
              {...register('phoneNumber')}
              hasError={!!errors.phoneNumber}
            />
          </FormGroup>
          <FormGroup className="mb-4">
            <Label htmlFor="department">Department</Label>
            <MultiSelect
              placeholderText="Select department"
              list={departments}
              onSelectItem={setSelectedDepartment}
              selectedItem={selectedDepartment}
            />
            {multiSelectError && (
              <FormControlError message={multiSelectError} />
            )}
          </FormGroup>
        </>
      ) : (
        <p className="mb-4">
          Are you sure you want to delete{' '}
          <strong>{selectedStudent?.user.name}</strong>? Please remember that
          this action cannot be undone
        </p>
      )}
      <FormFooter className="gap-4">
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

export function BulkUpload({ currentTab }: BulkUploadProps) {
  const entity = isActiveTabLecturer(currentTab) ? 'Lecturers' : 'Students';

  return (
    <>
      <SubPageHeader
        title="Bulk upload"
        description={`Add ${entity} in bulk here`}
      />
      <MainContent>
        <GoBack path={`${MANAGE_USERS_ROOT_PATH}?tab=${currentTab}`} />

        <Headline type="h2" className="mt-10 mb-6 xl:mb-10 2xl:mb-12">
          Bulk Upload for {entity}
        </Headline>
        <div className="mb-6 xl:mb-12 2xl:mb-[85px] space-y-2">
          <Headline type="h3">Instructions</Headline>
          <ol className="mx-4 list-decimal">
            <li>Download the CSV template</li>
            <li>
              Fill in the required information in the following format:
              Name(First name and Last name) <br />
              Email address, Phone number, Department, Qualification.
            </li>
            <li>Upload the completed CSV file</li>
          </ol>
        </div>

        <div className="mb-6 xl:mb-12 2xl:mb-[85px] space-y-2">
          <Headline type="h3">Download CSV Template</Headline>
          <p>
            Download the CSV Template to fill in the required information for
            bulk upload
          </p>
          <Button
            el="link"
            variant="secondary"
            href={isActiveTabLecturer(currentTab) ? '' : ''}
            className="w-[197px] text-center"
          >
            Download template
          </Button>
        </div>

        <div className="mb-6 xl:mb-12 2xl:mb-0 space-y-2">
          <Headline type="h3">Upload CSV File</Headline>
          <p>
            Choose a CSV File from your computer to initiate the bulk upload
            process.
          </p>
          <Button
            el="button"
            type="submit"
            variant="primary"
            className="w-[197px]"
          >
            Browse
          </Button>
        </div>
      </MainContent>
    </>
  );
}
