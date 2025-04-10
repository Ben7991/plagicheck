import { HttpStatus } from '@util/enum/http-status.enum';
import { getToken } from '@util/get-token.util';
import { getAuthHeaders } from '@util/http-handler.util';
import { processedStatusCode } from '@util/processed-status-code.util';
import { refreshAccessToken } from '@util/refresh-token.util';
import { DocumentType } from '@util/types/archive.type';

export const ARCHIVE_COLUMN_HEADINGS = [
  'Project name',
  'Upload Date/Time',
  'Type',
  '',
];

export async function getArchives(
  page?: number,
  query?: string,
  filter?: string,
) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/archives?page=${page ? page - 1 : 0}&q=${query}&filter=${filter ?? ''}`,
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
      return await getArchives(page, query);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function createArchive(formData: FormData) {
  const token = getToken();
  const response = await fetch('http://localhost:3000/api/archives', {
    method: 'POST',
    body: formData,
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
      return await createArchive(formData);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function deleteArchive(id: number) {
  const token = getToken();
  const response = await fetch(`http://localhost:3000/api/archives/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
  });
  const result = await response.json();

  if (processedStatusCode.includes(response.status)) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await deleteArchive(id);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export function getFilters(
  wordFilter: boolean,
  pdfFilter: boolean,
  textFilter: boolean,
) {
  const changedFilters: Array<string> = [];

  if (wordFilter) {
    changedFilters.push('WORD');
  }

  if (pdfFilter) {
    changedFilters.push('PDF');
  }

  if (textFilter) {
    changedFilters.push('TEXT');
  }

  return changedFilters;
}

export async function downloadArchive(id: number) {
  const token = getToken();
  const response = await fetch(
    `http://localhost:3000/api/archives/${id}/download`,
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
  );

  const result = await response.blob();

  if (processedStatusCode.includes(response.status)) {
    const errorResult = await response.json();
    throw new Error(errorResult.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await downloadArchive(id);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export function getContentType(documentType: DocumentType) {
  switch (documentType) {
    case DocumentType.PDF:
      return 'application/pdf';
    case DocumentType.TEXT:
      return 'text/plain';
    default:
      return 'application/msword';
  }
}
