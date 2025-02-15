import * as yup from 'yup';

export type Inputs = {
  newPassword: string;
  confirmPassword: string;
};

export const schema = yup.object({
  newPassword: yup
    .string()
    .required('New Password is required')
    .min(8, 'Must be at least 8 characters or more')
    .max(30, 'Must be 30 characters or less')
    .trim(),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .test({
      test: (value, ctx) => {
        const newPassword = ctx.parent.newPassword;
        return value === newPassword;
      },
      message: 'Passwords do not match each other',
    })
    .trim(),
});

export async function validateResetToken(token: string | null) {
  const response = await fetch(
    `http://localhost:3000/api/auth/validate-reset-token?token=${token}`,
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }
}
