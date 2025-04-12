import { ComponentPropsWithoutRef, useState } from 'react';

import Button from '@components/atoms/button/Button';
import ExportIcon from '@components/atoms/icons/ExportIcon';

export function ExportHandler() {
  const [showExportList, setShowExportList] = useState(false);

  return (
    <div className="relative">
      <Button
        el="button"
        variant="primary"
        className="w-[109px] flex items-center gap-2 justify-center"
        onClick={() => setShowExportList(!showExportList)}
      >
        Export
        <ExportIcon />
      </Button>
      {showExportList && (
        <div className="bg-white shadow-lg absolute top-[52px] w-[127px] flex flex-col gap-4 rounded-lg py-2 lg:py-4 border border-[var(--gray-1000)] right-0">
          <ExportButton>PDF</ExportButton>
          <ExportButton>Excel</ExportButton>
        </div>
      )}
    </div>
  );
}

function ExportButton(props: ComponentPropsWithoutRef<'button'>) {
  return (
    <button className="px-4 inline-block hover:bg-[var(--sea-blue-100)] hover:text-white cursor-pointer text-left">
      {props.children}
    </button>
  );
}
