import { ComponentPropsWithoutRef } from 'react';

export type AnchorProps = {
  el: 'link';
  variant: 'primary' | 'danger' | 'secondary';
} & ComponentPropsWithoutRef<'a'>;

export type ButtonProps = {
  el: 'button';
  variant: 'primary' | 'danger' | 'secondary';
} & ComponentPropsWithoutRef<'button'>;
