import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  DepartmentForm,
  DepartmentList,
  FacultyForm,
} from './academic-division.partials';
import { getFaculties } from './academic-division.utils';
import { useAppDispatch, useAppSelector } from '@store/store.util';
import { loadFaculties } from '@store/slice/faculty/faculty.slice';
import { useAlert } from '@util/hooks/use-alert/useAlert';
import Button from '@components/atoms/button/Button';
import PageHeader from '@components/organisms/page-header/PageHeader';
import SubPageHeader from '@components/organisms/page-header/SubPageHeader';
import Modal from '@components/organisms/modal/Modal';
import DataTable from '@components/organisms/data-table/DataTable';
import MainContent from '@components/atoms/main-content/MainContent';
import ErrorBoundary from '../../error/error-boundary/ErrorBoundary';
import Paginator from '@components/organisms/paginator/Paginator';
import Alert from '@components/molecules/alert/Alert';
import { Faculty } from '@util/types/faculty.type';
import { Department } from '@util/types/department.type';

export default function AcademicDivision() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [faculty, setFaculty] = useState<Faculty>();
  const [department, setDepartment] = useState<Department>();
  const dataTableActionHolderRef = useRef<{ onHide: VoidFunction }>(null);
  const departmentListRef = useRef<{ onHide: VoidFunction }>(null);
  const facultyData = useAppSelector((state) => state.faculty);
  const { alertState, alertInfo, hideAlert, setAlertInfo, showAlert } =
    useAlert();

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const searchQuery = searchParams.get('q') ?? undefined;
        const page = searchParams.get('page') ?? 1;
        const result = await getFaculties(false, +page, searchQuery);
        dispatch(
          loadFaculties({
            data: result.data,
            count: result.count,
          }),
        );
      } catch (error) {
        setErrorMessage((error as Error).message);
      }
    };

    fetchFaculties();
  }, [dispatch, searchParams]);

  if (errorMessage) {
    return (
      <ErrorBoundary
        message={errorMessage}
        path="/dashboard/academic-division"
        fullScreen={false}
      />
    );
  }

  const handleActiveModal = (
    tab: 'department' | 'faculty',
    action: 'add' | 'edit' | 'delete',
  ) => {
    const queryParams = new URLSearchParams();
    queryParams.set('tab', tab);
    queryParams.set('action', action);

    if (searchParams.get('page')) {
      queryParams.set('page', searchParams.get('page')!);
    }
    navigate(`/dashboard/academic-division?${queryParams.toString()}`);
  };

  const goBack = () => {
    if (!searchParams.get('page')) {
      return navigate(`/dashboard/academic-division`);
    }

    const queryParams = new URLSearchParams();
    queryParams.set('page', searchParams.get('page')!);
    navigate(`/dashboard/academic-division?${queryParams.toString()}`);
  };

  const activeTab = searchParams.get('tab');
  const activeAction = searchParams.get('action');
  let form: JSX.Element | undefined = undefined;

  if (
    activeTab === 'faculty' &&
    activeAction &&
    ['add', 'edit', 'delete'].includes(activeAction)
  ) {
    form = (
      <FacultyForm
        selectedFaculty={faculty}
        onCancel={goBack}
        onSetAlertInfo={setAlertInfo}
        onShowAlert={showAlert}
        currentAction={activeAction as 'add' | 'edit' | 'delete'}
      />
    );
  } else if (
    activeTab === 'department' &&
    activeAction &&
    ['add', 'edit', 'delete'].includes(activeAction)
  ) {
    form = (
      <DepartmentForm
        selectedDepartment={department}
        selectedFacultyId={faculty?.id}
        onCancel={goBack}
        onSetAlertInfo={setAlertInfo}
        onShowAlert={showAlert}
        currentAction={activeAction as 'add' | 'edit' | 'delete'}
      />
    );
  }

  let formHeading = '';

  if (activeAction && activeTab) {
    const action =
      activeAction.substring(0, 1).toUpperCase() +
      activeAction.substring(1, activeAction.length);
    const tab =
      activeTab.substring(0, 1).toUpperCase() +
      activeTab.substring(1, activeTab.length);
    formHeading = `${action} ${tab}`;
  }

  return (
    <>
      <PageHeader />
      <SubPageHeader
        title="Academic Unit"
        description="Add faculties and departments here"
      >
        <div className="flex gap-4">
          <Button
            el="button"
            variant="secondary"
            className="w-[162px]"
            onClick={() => handleActiveModal('department', 'add')}
          >
            Add Department
          </Button>
          <Button
            el="button"
            variant="primary"
            className="w-[128px]"
            onClick={() => handleActiveModal('faculty', 'add')}
          >
            Add Faculty
          </Button>
        </div>
      </SubPageHeader>
      <MainContent>
        <DataTable columnHeadings={['Faculty name', 'Departments', '']}>
          {facultyData.data.map((faculty) => (
            <tr key={faculty.id}>
              <td>{faculty.name}</td>
              <td>
                <DepartmentList
                  ref={departmentListRef}
                  departments={faculty.departments}
                  onSelectDepartment={setDepartment}
                  onEdit={() => {
                    setFaculty(faculty);
                    handleActiveModal('department', 'edit');
                    departmentListRef.current?.onHide();
                  }}
                  onDelete={() => {
                    setFaculty(faculty);
                    handleActiveModal('department', 'delete');
                    departmentListRef.current?.onHide();
                  }}
                />
              </td>
              <td>
                <DataTable.ActionHolder ref={dataTableActionHolderRef}>
                  <DataTable.Action
                    text="Edit Faculty"
                    onClick={() => {
                      dataTableActionHolderRef.current?.onHide();
                      handleActiveModal('faculty', 'edit');
                      setFaculty(faculty);
                    }}
                  />
                  <DataTable.Action
                    text="Delete Faculty"
                    onClick={() => {
                      dataTableActionHolderRef.current?.onHide();
                      handleActiveModal('faculty', 'delete');
                      setFaculty(faculty);
                    }}
                  />
                </DataTable.ActionHolder>
              </td>
            </tr>
          ))}
        </DataTable>
        <Paginator count={facultyData.count} />
      </MainContent>

      {form && (
        <Modal onHide={goBack} title={formHeading}>
          {form}
        </Modal>
      )}

      {alertState && alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onHide={hideAlert}
        />
      )}
    </>
  );
}
