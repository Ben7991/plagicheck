import { SubPageHeaderProps } from './page-header.util';
import Headline from '../../atoms/headline/Headline';

export default function SubPageHeader({
  title,
  description,
  children,
}: SubPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:justify-between md:gap-0 md:items-center py-3 px-4 md:py-4 md:px-5 xl:px-[41px] border-b border-b-[var(--gray-700)] mt-18 md:mt-20 lg:mt-0">
      <div className="space-y-1">
        <Headline type="h4">{title}</Headline>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
