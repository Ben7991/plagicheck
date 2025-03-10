import { forwardRef, useImperativeHandle, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';

import {
  DataTableActionHolderProps,
  DataTableActionProps,
} from './data-table.util';

export const DataTableActionHolder = forwardRef<
  { onHide: VoidFunction },
  DataTableActionHolderProps
>(({ children }, ref) => {
  const [showActions, setShowActions] = useState(false);

  useImperativeHandle(ref, () => ({
    onHide: () => setShowActions(false),
  }));

  return (
    <div className="inline-block relative">
      <button
        className="cursor-pointer inline-block"
        onClick={() => setShowActions(!showActions)}
      >
        <BsThreeDotsVertical />
      </button>
      {showActions && (
        <div className="absolute bg-white rounded-lg border border-[var(--gray-1000)] shadow-lg w-[179px] flex flex-col gap-2 lg:gap-4 p-2 lg:p-4 z-[2] right-0">
          {children}
        </div>
      )}
    </div>
  );
});

export function DataTableAction({ text, onClick }: DataTableActionProps) {
  return (
    <button
      onClick={onClick}
      className="text-[var(--black-300)] hover:text-[var(--sea-blue-100)] hover:font-semibold text-left cursor-pointer"
    >
      {text}
    </button>
  );
}
