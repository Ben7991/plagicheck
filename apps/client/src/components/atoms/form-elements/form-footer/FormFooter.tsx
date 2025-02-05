import { ReactNode } from 'react';

type FormFooderProps = {
  children: ReactNode;
  className?: string;
};

export default function FormFooter({
  children,
  className,
}: FormFooderProps): JSX.Element {
  return <div className={`flex ${className}`}>{children}</div>;
}
