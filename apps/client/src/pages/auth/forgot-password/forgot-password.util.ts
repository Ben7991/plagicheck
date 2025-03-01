import * as yup from 'yup';

export type Inputs = {
  email: string;
};

export const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Invalid email address'),
});

export async function requestPasswordReset(data: { email: string }) {
  const response = await fetch(
    'http://localhost:3000/api/auth/request-password-reset',
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  const result = (await response.json()) as { message: string };

  return result;
}
