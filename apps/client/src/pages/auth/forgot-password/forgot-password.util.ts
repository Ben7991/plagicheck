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
