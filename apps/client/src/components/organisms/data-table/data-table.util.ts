import { ReactNode } from 'react';

export type DataTableProps = {
  columnHeadings: string[];
  children: ReactNode;
};

export type DataTableActionHolderProps = {
  children: ReactNode;
};

export type DataTableActionProps = {
  text: string;
  onClick: VoidFunction;
};
