import * as yup from 'yup';
import { User } from '../../../util/types/user.type';

export type Inputs = {
  username: string;
  password: string;
  rememberMe?: boolean;
};

export enum AuthenticatedStatus {
  STALE = 'stale',
  AUTHENTICATED = 'authenticated',
  NOT_YET = 'not-yet',
}

export const schema = yup.object({
  username: yup.string().required('Email/ID is required').trim(),
  password: yup.string().required('Password is required').trim(),
});

export async function signIn(data: Inputs) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? 'Something went wrong');
  }

  return result as { message: string; data: User };
}

export function setRememberMe(): void {
  localStorage.setItem('_remember-me', 'true');
}

export function getRememberMe(): boolean {
  return !!localStorage.getItem('_remember-me');
}

export async function validateToken(): Promise<{ data: User }> {
  const response = await fetch(
    'http://localhost:3000/api/auth/validate-token',
    {
      method: 'GET',
      credentials: 'include',
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? 'Something went wrong');
  }

  return result as { data: User };
}
