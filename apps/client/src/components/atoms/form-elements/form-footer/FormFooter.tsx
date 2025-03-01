import { FormFooderProps } from './form-footer.util';

export default function FormFooter({
  children,
  className,
}: FormFooderProps): JSX.Element {
  return <div className={`flex ${className}`}>{children}</div>;
}
