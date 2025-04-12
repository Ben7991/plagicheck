import { Link } from 'react-router-dom';

import LeftArrowIcon from '@components/atoms/icons/LeftArrowIcon';

type GoBackProps = {
  path: string;
};

export default function GoBack({ path }: GoBackProps) {
  return (
    <Link
      to={path}
      className="inline-block py-2 px-4 hover:bg-gray-200 w-auto rounded-lg"
    >
      <span className="flex items-center gap-2">
        <LeftArrowIcon /> Back
      </span>
    </Link>
  );
}
