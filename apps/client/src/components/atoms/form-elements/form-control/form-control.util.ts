import { ComponentPropsWithRef } from 'react';

export type FormControlProps = {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
} & ComponentPropsWithRef<'input'>;
