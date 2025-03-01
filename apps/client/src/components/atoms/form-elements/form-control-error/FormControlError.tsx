import { FormControlErrorProps } from './form-control-error.util';

export default function FormControlError({ message }: FormControlErrorProps) {
  return (
    <small className="inline-block text-[var(--error-100)]">{message}</small>
  );
}
