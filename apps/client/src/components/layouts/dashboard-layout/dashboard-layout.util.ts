import { HttpStatus } from '../../../util/enum/http-status.enum';
import { getToken } from '../../../util/get-token.util';
import { refreshAccessToken } from '../../../util/refresh-token.util';

export async function getAuthUser() {
  const token = getToken();

  const response = await fetch('http://localhost:3000/api/auth/user', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (response.status === HttpStatus.BAD_REQUEST) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await getAuthUser();
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}
