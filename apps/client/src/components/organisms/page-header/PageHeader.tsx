import { useRef } from 'react';
import { PiHamburger } from 'react-icons/pi';

import AppLogo from '../../molecules/app-logo/AppLogo';
import { MobileDrawerObserver } from '../../../util/observer/mobile-drawer.observer';
import FormControl from '../../atoms/form-elements/form-control/FormControl';
import SearchIcon from '../../atoms/icons/SearchIcon';
import UserProfile from '../../molecules/user-profile/UserProfile';

export default function PageHeader() {
  const drawerObserverRef = useRef(MobileDrawerObserver.getInstance());

  const handleClick = () => {
    drawerObserverRef.current.toggle();
  };

  return (
    <header className="border-b border-b-[var(--gray-800)] py-3 px-4 md:py-4 md:px-5 xl:py-[19px] xl:px-[41px]">
      <div className="flex justify-between items-center lg:hidden">
        <AppLogo />
        <button className="inline-block" onClick={handleClick}>
          <PiHamburger className="text-2xl" />
        </button>
      </div>
      <div className="hidden lg:flex lg:justify-between lg:items-center">
        <FormControl
          placeholder="Search anything here"
          className="py-[8px!important] basis-[307px]"
          leftIcon={<SearchIcon width={20} height={20} />}
        />
        <UserProfile />
      </div>
    </header>
  );
}
