import { Link } from 'react-router-dom';

import { SubPageHeaderProps } from './page-header.util';
import Headline from '../../atoms/headline/Headline';
import CaretRightIcon from '@components/atoms/icons/CaretRightIcon';

export default function SubPageHeader({
  title,
  description,
  showBackArrow,
  showBackArrowPath,
  children,
}: SubPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0 md:items-center py-3 px-4 md:py-4 md:px-5 xl:px-[41px] border-b border-b-[var(--gray-700)] mt-18 md:mt-20 lg:mt-0">
      <div className="flex items-center gap-4 lg:gap-6">
        {showBackArrow && showBackArrowPath && (
          <Link
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-[var(--gray-800)] shadow-md cursor-pointer hover:bg-[var(--gray-1000)] disabled:cursor-not-allowed"
            to={showBackArrowPath}
          >
            <CaretRightIcon />
          </Link>
        )}
        <div className="space-y-1">
          <Headline type="h4">{title}</Headline>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
