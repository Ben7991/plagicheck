import { ComponentPropsWithoutRef } from 'react';

type FormControlProps = {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
} & ComponentPropsWithoutRef<'input'>;

export default function FormControl({
  leftIcon,
  rightIcon,
  ...props
}: FormControlProps): JSX.Element {
  const { className, ...remainingProps } = props;

  return (
    <div className="flex items-center py-[10px] px-4 border border-[var(--gray-700)] rounded-lg gap-2">
      {leftIcon}
      <input
        {...remainingProps}
        className={`${className} flex-grow outline-none`}
      />
      {rightIcon}
    </div>
  );
}
