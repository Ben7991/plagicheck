import { forwardRef } from 'react';

import { FormControlProps } from './form-control.util';

const FormControl = forwardRef<HTMLInputElement, FormControlProps>(
  ({ leftIcon, rightIcon, ...props }: FormControlProps, ref): JSX.Element => {
    const { className, ...remainingProps } = props;

    return (
      <div className="flex items-center py-[10px] px-4 border border-[var(--gray-700)] rounded-lg gap-2">
        {leftIcon}
        <input
          {...remainingProps}
          className={`${className} flex-grow outline-none`}
          ref={ref}
        />
        {rightIcon}
      </div>
    );
  },
);

export default FormControl;
