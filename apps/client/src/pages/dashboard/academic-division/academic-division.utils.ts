import { object, string } from 'yup';

import { HttpStatus } from '@util/enum/http-status.enum';
import { getToken } from '@util/get-token.util';
import { processedStatusCode } from '@util/processed-status-code.util';
import { refreshAccessToken } from '@util/refresh-token.util';
import { getAuthHeaders } from '@util/http-handler.util';

export async function getFaculties(
  all: boolean = false,
  page?: number,
  query?: string,
) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/faculties?all=${all}&page=${page ? page - 1 : 0}&q=${query ?? ''}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
      },
    },
  );

  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await getFaculties(all, page, query);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function getDepartments() {
  const token = getToken();
  const response = await fetch('http://localhost:3000/api/departments', {
    method: 'GET',
    credentials: 'include',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await getDepartments();
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export const academicDivisionSchema = object({
  name: string()
    .required('Name is required')
    .matches(/^[a-zA-Z ]*$/, 'Only letters and whitespaces are allowed'),
});

export async function createFaculty(data: { name: string }) {
  const token = getToken();
  const response = await fetch('http://localhost:3000/api/faculties', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await createFaculty(data);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function updateFaculty(data: { name: string }, facultyId: number) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/faculties/${facultyId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await updateFaculty(data, facultyId);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function deleteFaculty(facultyId: number) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/faculties/${facultyId}`,
    {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await deleteFaculty(facultyId);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function createDepartment(data: {
  name: string;
  facultyId: number;
}) {
  const token = getToken();
  const response = await fetch('http://localhost:3000/api/departments', {
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
      return await createDepartment(data);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function updateDepartment(
  data: {
    name: string;
    facultyId: number;
  },
  departmentId: number,
) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/departments/${departmentId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
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
      return await updateDepartment(data, departmentId);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function deleteDepartment(departmentId: number) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/departments/${departmentId}`,
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
      return await deleteDepartment(departmentId);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}
