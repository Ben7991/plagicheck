import { ComponentPropsWithoutRef } from 'react';

export default function FormGroup(
  props: ComponentPropsWithoutRef<'div'>,
): JSX.Element {
  const { children, ...remainingProps } = props;

  return <div {...remainingProps}>{children}</div>;
}
