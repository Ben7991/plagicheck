import { forwardRef } from 'react';

import { FormControlProps } from './form-control.util';

const FormControl = forwardRef<HTMLInputElement, FormControlProps>(
  (
    { hasError, leftIcon, rightIcon, ...props }: FormControlProps,
    ref,
  ): JSX.Element => {
    const { className, ...remainingProps } = props;

    return (
      <div
        className={`flex items-center px-4 border rounded-lg gap-2 ${hasError ? 'border-[var(--error-100)]' : 'border-[var(--gray-700)]'} ${className}`}
      >
        {leftIcon}
        <input
          {...remainingProps}
          className="flex-grow outline-none py-[10px]"
          ref={ref}
        />
        {rightIcon}
      </div>
    );
  },
);

export default FormControl;
