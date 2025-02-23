import { FormEvent, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GoDatabase } from 'react-icons/go';
import { RxCounterClockwiseClock } from 'react-icons/rx';

import {
  dropDownItemClass,
  logout,
  navLinkClass,
  SideDrawerProps,
} from './side-drawer.util';
import { useAlert } from '../../../util/hooks/use-alert/useAlert';
import { AlertVariant } from '../../../util/enum/alert-variant.enum';
import { useAppDispatch } from '../../../store/store.util';
import { logoutAuthUser } from '../../../store/slice/auth/auth.slice';
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
import Alert from '../../molecules/alert/Alert';

export default function SideDrawer({ show, onHide }: SideDrawerProps) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropDown, setShowDropDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { alertState, alertInfo, hideAlert, setAlertInfo, showAlert } =
    useAlert();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      await logout();
      dispatch(logoutAuthUser());
      navigate('/');
    } catch (error) {
      setAlertInfo({
        message: (error as Error).message,
        variant: AlertVariant.ERROR,
      });
      showAlert();
    }

    setIsLoading(false);
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
          <NavLink
            to="/dashboard"
            className={navLinkClass}
            end
            onClick={onHide}
          >
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
                  onClick={onHide}
                >
                  <SearchIcon />
                  Checker
                </NavLink>
                <NavLink
                  to="/dashboard/checker/schedule"
                  className={dropDownItemClass}
                  onClick={onHide}
                >
                  <ClockIcon />
                  Schedule
                </NavLink>
                <NavLink
                  to="/dashboard/checker/history"
                  className={dropDownItemClass}
                  onClick={onHide}
                >
                  <RxCounterClockwiseClock width={16} height={16} />
                  History
                </NavLink>
              </div>
            )}
          </div>
          <NavLink
            to="/dashboard/academic-division"
            className={navLinkClass}
            onClick={onHide}
          >
            <OpenBookIcon />
            Academic division
          </NavLink>
          <NavLink
            to="/dashboard/archive"
            className={navLinkClass}
            onClick={onHide}
          >
            <GoDatabase className="text-2xl" />
            Archive
          </NavLink>
          <NavLink
            to="/dashboard/manage-users?tab=lecturer"
            className={navLinkClass}
            onClick={onHide}
          >
            <UsersIcon />
            Manage Users
          </NavLink>
          <NavLink
            to="/dashboard/account-settings?tab=personal"
            className={navLinkClass}
            onClick={onHide}
          >
            <GearIcon />
            Account settings
          </NavLink>
        </div>
        <div className="px-[25px]">
          <button
            className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-[var(--gray-100)] cursor-pointer w-full"
            type="button"
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
          <form onSubmit={handleSubmit}>
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
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Yes, logout'}
              </Button>
            </FormFooter>
          </form>
        </Modal>
      )}

      {alertState && alertInfo && (
        <Alert
          message={alertInfo.message}
          variant={alertInfo.variant}
          onHide={hideAlert}
        />
      )}
    </>
  );
}
