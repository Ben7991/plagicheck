import { object, string } from 'yup';

import { getToken } from '../../../util/get-token.util';
import { refreshAccessToken } from '../../../util/refresh-token.util';
import { HttpStatus } from '../../../util/enum/http-status.enum';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';

export type PersonalInfoInputs = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type PasswordInputs = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type AlertInfoProps = {
  onShowAlert: VoidFunction;
  onSetAlertInfo: (value: { message: string; variant: AlertVariant }) => void;
};

export const personalInfoSchema = object({
  firstName: string()
    .required('First name is required')
    .matches(/^[a-zA-Z]*$/, 'Only letters are allowed')
    .min(3, 'Must be 3 characters or more'),
  lastName: string()
    .required('Last name is required')
    .matches(/^[a-zA-Z]*$/, 'Only letters are allowed')
    .min(3, 'Must be 3 characters or more'),
  email: string()
    .required('Email address is required')
    .email('Invalid email address')
    .test({
      test: async (value) => {
        if (!value) {
          return false;
        }

        try {
          await checkEmail(value);
          return true;
        } catch {
          return false;
        }
      },
      message: 'Email already taken',
    }),
  phone: string()
    .required('Phone is required')
    .matches(/^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$/, 'Invalid phone number'),
});

export const passwordSchema = object({
  currentPassword: string()
    .required('Current password is required')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Invalid password format',
    ),
  newPassword: string()
    .required('New password is required')
    .matches(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Invalid password format',
    ),
  confirmPassword: string()
    .required('Confirm password is required')
    .test({
      test: (value, ctx) => {
        return value === ctx.parent.newPassword;
      },
      message: 'Password do not match each other',
    }),
});

export async function checkEmail(email: string): Promise<void> {
  const token = getToken();

  const response = await fetch('http://localhost:3000/api/users/check-email', {
    method: 'POST',
    body: JSON.stringify({ email }),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (response.status === HttpStatus.BAD_REQUEST) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await checkEmail(email);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export async function changePersonalInformation(
  data: PersonalInfoInputs,
): Promise<{ message: string }> {
  const token = getToken();

  const response = await fetch(
    'http://localhost:3000/api/users/personal-info',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    },
  );
  const result = await response.json();

  if (response.status === HttpStatus.BAD_REQUEST) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await changePersonalInformation(data);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result as { message: string };
}

export async function changePassword(data: PasswordInputs) {
  const token = getToken();

  const response = await fetch('http://localhost:3000/api/users/password', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (response.status === HttpStatus.BAD_REQUEST) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await changePassword(data);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result as { message: string };
}

export async function changeImage(data: FormData) {
  const token = getToken();
  const response = await fetch('http://localhost:3000/api/users/change-image', {
    method: 'POST',
    body: data,
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
      return await changeImage(data);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}

export function isImage(file: File) {
  const mimeType = file.type;
  const [fileType, extension] = mimeType.split('/');

  const acceptedFileExtensions = ['jpg', 'png', 'jpeg'];

  return (
    fileType === 'image' &&
    acceptedFileExtensions.includes(extension.toLowerCase())
  );
}

export async function deleteAccount(userId: string) {
  const token = getToken();
  const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (
    response.status === HttpStatus.BAD_REQUEST ||
    response.status === HttpStatus.FORBIDDEN
  ) {
    throw new Error(result.message);
  } else if (response.status === HttpStatus.UN_AUTHORIZED) {
    const result = await refreshAccessToken();

    if (result) {
      return await deleteAccount(userId);
    } else {
      throw new Error('UN_AUTHORIZED');
    }
  }

  return result;
}
