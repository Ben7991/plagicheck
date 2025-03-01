import { ComponentPropsWithoutRef } from 'react';

export default function Label(
  props: ComponentPropsWithoutRef<'label'>,
): JSX.Element {
  const { children, className, ...remainingProps } = props;
  return (
    <label
      className={`${className} text-[0.875em] mb-1 inline-block`}
      {...remainingProps}
    >
      {children}
    </label>
  );
}
