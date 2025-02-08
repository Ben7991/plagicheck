import { useEffect, useRef } from 'react';
import { IoCloseSharp } from 'react-icons/io5';

import { AlertProps } from './alert.util';
import CloseCircleIcon from '../../atoms/icons/CloseCircleIcon';
import CheckCircleIcon from '../../atoms/icons/CheckCircleIcon';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';

export default function Alert({ message, variant, onHide }: AlertProps) {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      onHide();
    }, 3000);

    return () => clearTimeout(timerRef.current);
  }, [onHide]);

  let variantClasses = '';

  if (variant === AlertVariant.SUCCESS) {
    variantClasses +=
      ' border border-[var(--success-700)] text-[var(--success-100)]';
  } else {
    variantClasses +=
      ' border border-[var(--error-500)] text-[var(--error-100)]';
  }

  return (
    <div
      className={`fixed top-5 md:top-12 left-1/2 -translate-x-1/2 shadow-md rounded-lg w-[90%] md:w-[554px] flex items-center justify-between py-3 px-4 bg-white ${variantClasses}`}
      role="alert"
    >
      <div className="flex gap-3">
        {variant === AlertVariant.SUCCESS ? (
          <CheckCircleIcon />
        ) : (
          <CloseCircleIcon />
        )}
        <p>{message}</p>
      </div>
      <button
        className="inline-block text-gray-500 hover:text-[var(--error-100)] cursor-pointer"
        onClick={onHide}
      >
        <IoCloseSharp className="text-2xl" />
      </button>
    </div>
  );
}
