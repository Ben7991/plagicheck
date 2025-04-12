import { ReactNode } from 'react';

export type SubPageHeaderProps = {
  title: string;
  description: string;
  showBackArrow?: boolean;
  showBackArrowPath?: string;
  children?: ReactNode;
};

export type PageHeaderProps = {
  searchRootPath?: string;
};
