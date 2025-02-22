import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { GoDatabase } from 'react-icons/go';
import { RxCounterClockwiseClock } from 'react-icons/rx';

import { NavLinkClassNameProps, SideDrawerProps } from './side-drawer.util';
import AppLogo from '../../molecules/app-logo/AppLogo';
import DashboardIcon from '../../atoms/icons/DashboardIcon';
import PlagiCheckIcon from '../../atoms/icons/PlagiCheckIcon';
import OpenBookIcon from '../../atoms/icons/OpenBookIcon';
import UsersIcon from '../../atoms/icons/UsersIcon';
import GearIcon from '../../atoms/icons/GearIcon';
import LogoutIcon from '../../atoms/icons/LogoutIcon';
import SearchIcon from '../../atoms/icons/SearchIcon';
import ClockIcon from '../../atoms/icons/ClockIcon';
import UserProfile from '../../molecules/user-profile/UserProfile';
import Modal from '../modal/Modal';
import FormFooter from '../../atoms/form-elements/form-footer/FormFooter';
import Button from '../../atoms/button/Button';

export default function SideDrawer({ show, onHide }: SideDrawerProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);

  const navLinkClass = ({ isActive, isPending }: NavLinkClassNameProps) => {
    const className = 'flex items-center gap-2 py-2 px-4 rounded-lg';

    if (isActive) {
      return `${className} bg-[var(--sea-blue-100)] text-white nav-link-active`;
    } else if (isPending) {
      return `${className} hover:bg-[var(--gray-100)]`;
    } else {
      return `${className} hover:bg-[var(--gray-100)]`;
    }
  };

  const dropDownItemClass = ({
    isActive,
    isPending,
  }: NavLinkClassNameProps) => {
    const className =
      'flex items-center gap-2 py-1 px-4 rounded-lg text-[0.875em]';

    if (isActive) {
      return `${className} bg-[var(--sea-blue-100)] text-white nav-link-active`;
    } else if (isPending) {
      return `${className} hover:bg-[var(--gray-100)]`;
    } else {
      return `${className} hover:bg-[var(--gray-100)]`;
    }
  };

  return (
    <>
      <aside
        className={`w-0 bg-[var(--gray-1000)] border-r border-r-[var(--gray-800)] fixed top-0 left-0 h-screen lg:static lg:basis-[270px] lg:py-12 xl:py-14 overflow-y-auto transition-[width] ${show && 'w-2/3 md:w-[300px] overflow-x-hidden py-10 z-[5]'}`}
      >
        <div className="flex justify-center mb-10 lg:mb-10 xl:mb-[91.45px]">
          <AppLogo className="hidden lg:flex" />
          <UserProfile className="lg:hidden" />
        </div>
        <div className="flex flex-col gap-4 px-[25px] mb-20 lg:mb-15 xl:mb-40 2xl:mb-[205.12px]">
          <NavLink to="/dashboard" className={navLinkClass} end>
            <DashboardIcon /> Dashboard
          </NavLink>
          <div className="flex flex-col gap-1">
            <button
              className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-[var(--gray-100)] cursor-pointer"
              onClick={() => setShowDropDown(!showDropDown)}
            >
              <PlagiCheckIcon /> Plagiarism checker
            </button>
            {showDropDown && (
              <div className="flex flex-col ms-7 gap-1">
                <NavLink
                  to="/dashboard/checker"
                  className={dropDownItemClass}
                  end
                >
                  <SearchIcon />
                  Checker
                </NavLink>
                <NavLink
                  to="/dashboard/checker/schedule"
                  className={dropDownItemClass}
                >
                  <ClockIcon />
                  Schedule
                </NavLink>
                <NavLink
                  to="/dashboard/checker/history"
                  className={dropDownItemClass}
                >
                  <RxCounterClockwiseClock width={16} height={16} />
                  History
                </NavLink>
              </div>
            )}
          </div>
          <NavLink to="/dashboard/academic-division" className={navLinkClass}>
            <OpenBookIcon />
            Academic division
          </NavLink>
          <NavLink to="/dashboard/archive" className={navLinkClass}>
            <GoDatabase className="text-2xl" />
            Archive
          </NavLink>
          <NavLink
            to="/dashboard/manage-users?tab=lecturer"
            className={navLinkClass}
          >
            <UsersIcon />
            Manage Users
          </NavLink>
          <NavLink
            to="/dashboard/account-settings?tab=personal"
            className={navLinkClass}
          >
            <GearIcon />
            Account settings
          </NavLink>
        </div>
        <div className="px-[25px]">
          <button
            className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-[var(--gray-100)] cursor-pointer w-full"
            onClick={() => {
              setShowLogoutModal(true);
              onHide();
            }}
          >
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <Modal onHide={() => setShowLogoutModal(false)} title="Logout">
          <p className="mb-4">
            Are you sure you want to logout? By logging out, you will be
            securely logged out of the system and your session will be ended.
          </p>
          <form>
            <FormFooter className="gap-[19px]">
              <Button
                el="button"
                variant="secondary"
                type="button"
                className="basis-[197px]"
                onClick={() => setShowLogoutModal(false)}
              >
                No
              </Button>
              <Button
                el="button"
                variant="danger"
                type="submit"
                className="basis-[197px]"
              >
                Yes, logout
              </Button>
            </FormFooter>
          </form>
        </Modal>
      )}
    </>
  );
}
