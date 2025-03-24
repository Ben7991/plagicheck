import { object, string } from 'yup';

import { HttpStatus } from '@util/enum/http-status.enum';
import { getToken } from '@util/get-token.util';
import { processedStatusCode } from '@util/processed-status-code.util';
import { refreshAccessToken } from '@util/refresh-token.util';
import { getAuthHeaders } from '@util/http-handler.util';

export async function getUsers(
  userType: 'lecturers' | 'students',
  page?: number,
  query?: string,
) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/${userType}?page=${page ? page - 1 : 0}&q=${query ?? ''}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: getAuthHeaders(token),
    },
  );

  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await getUsers(userType, page, query);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function createUser(
  data: unknown,
  userType: 'lecturers' | 'students',
) {
  const token = getToken();
  const response = await fetch(`http://localhost:3000/api/${userType}`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: getAuthHeaders(token),
  });

  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await createUser(data, userType);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function updateUser(
  lecturer: unknown,
  id: string,
  userType: 'lecturers' | 'students',
) {
  const token = getToken();
  const response = await fetch(`http://localhost:3000/api/${userType}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(lecturer),
    credentials: 'include',
    headers: getAuthHeaders(token),
  });

  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await updateUser(lecturer, id, userType);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function deleteUser(
  lecturerId: string,
  userType: 'lecturers' | 'students',
) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/${userType}/${lecturerId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: getAuthHeaders(token),
    },
  );
  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await deleteUser(lecturerId, userType);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export function setModalHeading(activeTab: string, activeAction: string) {
  let modalHeading = '';

  if (activeAction && activeTab) {
    const action =
      activeAction.substring(0, 1).toUpperCase() +
      activeAction.substring(1, activeAction.length);
    const tab =
      activeTab.substring(0, 1).toUpperCase() +
      activeTab.substring(1, activeTab.length);
    modalHeading = `${action} ${tab}`;
  }

  return modalHeading;
}

export function isActiveTabLecturer(activeTab: string) {
  return activeTab === 'lecturer';
}

export function isActiveTabStudent(activeTab: string) {
  return activeTab === 'student';
}

export const MANAGE_USERS_ROOT_PATH = '/dashboard/manage-users';

export function getColumnHeadings(currentTab: string) {
  if (isActiveTabLecturer(currentTab)) {
    return [
      'Name',
      'Lecturer ID',
      'Email address',
      'Phone Number',
      'Department',
      'Qualification',
      '',
    ];
  }

  return [
    'Name',
    'Student ID',
    'Email address',
    'Phone Number',
    'Department',
    '',
  ];
}

const validation = {
  name: string()
    .required('Name is required')
    .matches(/^[a-zA-Z ]*$/)
    .trim(),
  email: string()
    .required('Email address is required')
    .email('Invalid email address')
    .trim(),
  phoneNumber: string()
    .required('Phone number is required')
    .matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, 'Invalid phone number')
    .trim(),
};

export const lecturerSchema = object({
  ...validation,
  qualification: string().required('Qualification is required').trim(),
});

export const studentSchema = object({
  ...validation,
});
