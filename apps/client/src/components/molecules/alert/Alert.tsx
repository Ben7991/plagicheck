import { IoCloseSharp } from 'react-icons/io5';

import { AlertProps } from './alert.util';
import CloseCircleIcon from '../../atoms/icons/CloseCircleIcon';
import CheckCircleIcon from '../../atoms/icons/CheckCircleIcon';

export default function Alert({ message, variant }: AlertProps) {
  let alertStyle =
    'fixed top-5 md:top-12 left-1/2 -translate-x-1/2 shadow-md rounded-lg w-[90%] md:w-[554px] flex items-center justify-between py-3 px-4 bg-white';

  if (variant === 'success') {
    alertStyle +=
      ' border border-[var(--success-700)] text-[var(--success-100)]';
  } else {
    alertStyle += ' border border-[var(--error-500)] text-[var(--error-100)]';
  }

  return (
    <div className={alertStyle} role="alert">
      <div className="flex gap-3">
        {variant === 'success' ? <CheckCircleIcon /> : <CloseCircleIcon />}
        <p>{message}</p>
      </div>
      <button className="inline-block text-gray-500 hover:text-[var(--error-100)] cursor-pointer">
        <IoCloseSharp className="text-2xl" />
      </button>
    </div>
  );
}
