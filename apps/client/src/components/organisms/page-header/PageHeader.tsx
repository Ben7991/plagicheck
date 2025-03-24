import { ChangeEvent, useRef } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { PiHamburger } from 'react-icons/pi';

import AppLogo from '../../molecules/app-logo/AppLogo';
import { MobileDrawerObserver } from '../../../util/observer/mobile-drawer.observer';
import FormControl from '../../atoms/form-elements/form-control/FormControl';
import SearchIcon from '../../atoms/icons/SearchIcon';
import UserProfile from '../../molecules/user-profile/UserProfile';
import { PageHeaderProps } from './page-header.util';

export default function PageHeader({ searchRootPath }: PageHeaderProps) {
  const timerRef = useRef<NodeJS.Timeout>();
  const drawerObserverRef = useRef(MobileDrawerObserver.getInstance());
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleClick = () => {
    drawerObserverRef.current.toggle();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const query = event.currentTarget.value;

    timerRef.current = setTimeout(() => {
      const searchParams = new URLSearchParams();
      searchParams.set('q', query);

      let path = '';

      if (searchRootPath) {
        path = `${searchRootPath}&${searchParams.toString()}`;
      } else {
        path = `${pathname}?${searchParams.toString()}`;
      }

      if (query) {
        navigate(path);
      } else {
        navigate(searchRootPath ?? pathname);
      }
    }, 600);
  };

  const query = searchParams.get('q');

  return (
    <header className="fixed top-0 left-0 w-full lg:sticky lg:top-0 bg-white border-b border-b-[var(--gray-800)] py-3 px-4 md:py-4 md:px-5 xl:py-[19px] xl:px-[41px] z-[2]">
      <div className="flex justify-between items-center lg:hidden">
        <AppLogo />
        <button className="inline-block" onClick={handleClick}>
          <PiHamburger className="text-2xl" />
        </button>
      </div>
      <div className="hidden lg:flex lg:justify-between lg:items-center">
        <FormControl
          placeholder="Search anything here"
          className="basis-[307px]"
          leftIcon={<SearchIcon width={20} height={20} />}
          onChange={handleChange}
          defaultValue={query ?? ''}
        />
        <UserProfile />
      </div>
    </header>
  );
}
