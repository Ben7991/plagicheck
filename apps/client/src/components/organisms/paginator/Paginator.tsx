import { Link, useSearchParams } from 'react-router-dom';

import LeftArrowIcon from '../../atoms/icons/LeftArrowIcon';
import RightArrowIcon from '../../atoms/icons/RightArrowIcon';

type PaginatorProps = {
  count: number;
};

export default function Paginator({ count }: PaginatorProps) {
  const [searchParams] = useSearchParams();
  const currentPage = searchParams.get('page') ?? 1;
  const searchQuery = searchParams.get('q') ?? '';
  const query = searchQuery ? `q=${searchQuery}&` : '';

  const links: JSX.Element[] = [];

  for (let i = 1; i <= Math.ceil(count / 9); i++) {
    links.push(
      <Link
        key={i}
        to={`/dashboard/academic-division?${query}page=${i}`}
        className={`p-2 lg:py-[10px] lg:px-4 border border-[var(--gray-700)] flex gap-2 ${+currentPage === i ? 'bg-[var(--gray-1000)]' : 'hover:bg-gray-100'}`}
      >
        {i}
      </Link>,
    );
  }

  return (
    <div className="flex items-center justify-center py-7">
      <Link
        to={`/dashboard/academic-division?${query}page=${+currentPage === 1 ? 1 : +currentPage - 1}`}
        className="p-2 lg:p-[10px] lg:px-4 rounded-tl-lg rounded-bl-lg border border-[var(--gray-700)] flex gap-2 hover:bg-gray-100"
      >
        <LeftArrowIcon /> Previous
      </Link>
      {links}
      <Link
        to={`/dashboard/academic-division?${query}page=${Math.ceil(count / 9) === +currentPage ? currentPage : +currentPage + 1}`}
        className="p-2 lg:py-[10px] lg:px-4 rounded-tr-lg rounded-br-lg border border-[var(--gray-700)] flex gap-2 hover:bg-gray-100"
      >
        Next <RightArrowIcon />
      </Link>
    </div>
  );
}
