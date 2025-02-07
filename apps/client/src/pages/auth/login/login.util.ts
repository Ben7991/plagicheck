import * as yup from 'yup';

export type Inputs = {
  username: string;
  password: string;
};

export const schema = yup.object({
  username: yup.string().required('Email/ID is required').trim(),
  password: yup.string().required('Password is required').trim(),
});
