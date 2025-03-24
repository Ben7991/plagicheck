import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  BulkUpload,
  LecturerForm,
  StudentForm,
  SubHeader,
} from './manage-users.partial';
import {
  getColumnHeadings,
  getUsers,
  isActiveTabLecturer,
  MANAGE_USERS_ROOT_PATH,
  setModalHeading,
} from './manage-users.util';
import { useAppDispatch, useAppSelector } from '@store/store.util';
import { loadStudents } from '@store/slice/student/student.slice';
import PageHeader from '@components/organisms/page-header/PageHeader';
import Button from '@components/atoms/button/Button';
import MainContent from '@components/atoms/main-content/MainContent';
import DataTable from '@components/organisms/data-table/DataTable';
import Modal from '@components/organisms/modal/Modal';
import { loadLecturers } from '@store/slice/lecturer/lecturer.slice';
import ErrorBoundary from '../../error/error-boundary/ErrorBoundary';
import Paginator from '@components/organisms/paginator/Paginator';
import Avatar from '@components/molecules/avatar/Avatar';
import { getDepartments } from '../academic-division/academic-division.utils';
import { Department } from '@util/types/department.type';
import { useAlert } from '@util/hooks/use-alert/useAlert';
import Alert from '@components/molecules/alert/Alert';
import { Lecturer, Student } from '@util/types/user.type';

export default function ManageUsers() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: lecturers, count: totalLecturers } = useAppSelector(
    (state) => state.lecturer,
  );
  const { count: totalStudents, data: students } = useAppSelector(
    (state) => state.student,
  );
  const [searchParams] = useSearchParams();
  const [fetchError, setFetchError] = useState('');
  const [selectedLecturer, setSelectedLecturer] = useState<Lecturer>();
  const [selectedStudent, setSelectedStudent] = useState<Student>();
  const [isDepartmentFetched, setIsDepartmentFetched] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const dataTableActionHolderRef = useRef<{ onHide: VoidFunction }>(null);
  const [departmentFetchError, setDepartmentFetchError] = useState('');
  const { alertState, alertInfo, hideAlert, setAlertInfo, showAlert } =
    useAlert();

  const currentTab = searchParams.get('tab') ?? '';
  const isBulkSet = searchParams.get('isBulk');
  const action = searchParams.get('action') ?? '';
  const userType = isActiveTabLecturer(currentTab) ? 'lecturers' : 'students';

  useEffect(() => {
    const fetchPaginatedUsers = async () => {
      try {
        const query = searchParams.get('q') ?? undefined;
        const page = searchParams.get('page') ?? 1;
        const result = await getUsers(userType, +page, query);
        if (isActiveTabLecturer(currentTab)) {
          dispatch(
            loadLecturers({
              data: result.data,
              count: result.count,
            }),
          );
        } else {
          dispatch(
            loadStudents({
              data: result.data,
              count: result.count,
            }),
          );
        }
        setFetchError('');
      } catch (error) {
        setFetchError((error as Error).message);
      }
    };

    fetchPaginatedUsers();
  }, [dispatch, searchParams, userType, currentTab]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const result = await getDepartments();
        setDepartments(result.data);
        setIsDepartmentFetched(true);
      } catch (error) {
        setDepartmentFetchError('Something went wrong');
      }
    };

    if (!isDepartmentFetched) {
      fetchDepartments();
    }
  }, [isDepartmentFetched]);

  if (fetchError) {
    return (
      <ErrorBoundary
        message={fetchError || departmentFetchError}
        path={`${MANAGE_USERS_ROOT_PATH}?tab=lecturer`}
        fullScreen={false}
      />
    );
  }

  const hideModal = () => {
    navigate(`${MANAGE_USERS_ROOT_PATH}?tab=${currentTab}`);
    setSelectedLecturer(undefined);
    setSelectedStudent(undefined);
  };

  const modalHeading = setModalHeading(currentTab, action);

  let form: JSX.Element | undefined = undefined;

  if (currentTab === 'lecturer') {
    form = (
      <LecturerForm
        departments={departments}
        onCancel={hideModal}
        currentAction={action as 'add' | 'edit' | 'delete'}
        onSetAlertInfo={setAlertInfo}
        onShowAlert={showAlert}
        selectedLecturer={selectedLecturer}
        onDeSelectLecturer={() => setSelectedLecturer(undefined)}
      />
    );
  } else if (currentTab === 'student') {
    form = (
      <StudentForm
        departments={departments}
        onCancel={hideModal}
        currentAction={action as 'add' | 'edit' | 'delete'}
        onSetAlertInfo={setAlertInfo}
        onShowAlert={showAlert}
        selectedStudent={selectedStudent}
        onDeSelectStudent={() => setSelectedStudent(undefined)}
      />
    );
  }

  return (
    <>
      <PageHeader
        searchRootPath={`${MANAGE_USERS_ROOT_PATH}?tab=${currentTab}`}
      />
      {!isBulkSet ? (
        <>
          <SubHeader currentTab={currentTab}>
            <Button
              el="link"
              variant="secondary"
              className="w-[127px] inline-block text-center"
              href={`${MANAGE_USERS_ROOT_PATH}?tab=${currentTab}&isBulk=yes`}
            >
              Bulk upload
            </Button>
            <Button
              el="link"
              variant="primary"
              className="w-[135px] inline-block text-center"
              href={`${MANAGE_USERS_ROOT_PATH}?tab=${currentTab}&action=add`}
            >
              Add {isActiveTabLecturer(currentTab) ? 'Lecturer' : 'Student'}
            </Button>
          </SubHeader>
          <MainContent>
            <DataTable columnHeadings={getColumnHeadings(currentTab)}>
              {isActiveTabLecturer(currentTab)
                ? lecturers.map((lecturer) => (
                    <tr key={lecturer.id}>
                      <td>
                        <Avatar
                          name={lecturer.user.name}
                          imagePath={lecturer.user.imagePath}
                        />
                      </td>
                      <td>{lecturer.user.id}</td>
                      <td>{lecturer.user.email}</td>
                      <td>{lecturer.user.phone}</td>
                      <td>{lecturer.department.name}</td>
                      <td>{lecturer.qualification}</td>
                      <td>
                        <DataTable.ActionHolder ref={dataTableActionHolderRef}>
                          <DataTable.Action
                            text="Edit Lecturer"
                            onClick={() => {
                              setSelectedLecturer(lecturer);
                              navigate(
                                `${MANAGE_USERS_ROOT_PATH}?tab=lecturer&action=edit`,
                              );
                              dataTableActionHolderRef.current?.onHide();
                            }}
                          />
                          <DataTable.Action
                            text="Delete Lecturer"
                            onClick={() => {
                              setSelectedLecturer(lecturer);
                              navigate(
                                `${MANAGE_USERS_ROOT_PATH}?tab=lecturer&action=delete`,
                              );
                              dataTableActionHolderRef.current?.onHide();
                            }}
                          />
                        </DataTable.ActionHolder>
                      </td>
                    </tr>
                  ))
                : students.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <Avatar
                          name={student.user.name}
                          imagePath={student.user.imagePath}
                        />
                      </td>
                      <td>{student.user.id}</td>
                      <td>{student.user.email}</td>
                      <td>{student.user.phone}</td>
                      <td>{student.department.name}</td>
                      <td>
                        <DataTable.ActionHolder ref={dataTableActionHolderRef}>
                          <DataTable.Action
                            text="Edit Student"
                            onClick={() => {
                              setSelectedStudent(student);
                              navigate(
                                `${MANAGE_USERS_ROOT_PATH}?tab=student&action=edit`,
                              );
                              dataTableActionHolderRef.current?.onHide();
                            }}
                          />
                          <DataTable.Action
                            text="Delete Student"
                            onClick={() => {
                              setSelectedStudent(student);
                              navigate(
                                `${MANAGE_USERS_ROOT_PATH}?tab=student&action=delete`,
                              );
                              dataTableActionHolderRef.current?.onHide();
                            }}
                          />
                        </DataTable.ActionHolder>
                      </td>
                    </tr>
                  ))}
            </DataTable>
            <Paginator
              count={
                isActiveTabLecturer(currentTab) ? totalLecturers : totalStudents
              }
            />
          </MainContent>
        </>
      ) : (
        <BulkUpload currentTab={currentTab} />
      )}

      {action && (
        <Modal title={modalHeading} onHide={hideModal}>
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
