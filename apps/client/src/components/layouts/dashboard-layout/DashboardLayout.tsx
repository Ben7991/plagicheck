import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import SideDrawer from '../../organisms/side-drawer/SideDrawer';
import Backdrop from '../../atoms/back-drop/Backdrop';
import { MobileDrawerObserver } from '../../../util/observer/mobile-drawer.observer';
import { getAuthUser } from './dashboard-layout.util';
import { useAppDispatch } from '../../../store/store.util';
import { setAuthUser } from '../../../store/slice/auth/auth.slice';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    const fetchAuthUser = async () => {
      try {
        const result = await getAuthUser();
        dispatch(setAuthUser(result.data));
      } catch (error) {
        navigate('/');
      }
    };

    fetchAuthUser();
  }, [navigate, dispatch]);

  const toggleDrawer = useCallback(() => {
    setShowDrawer(!showDrawer);
  }, [showDrawer]);

  useLayoutEffect(() => {
    const drawerObserver = MobileDrawerObserver.getInstance();
    drawerObserver.setListener(toggleDrawer);
  }, [toggleDrawer]);

  return (
    <main className="w-full h-screen lg:flex lg:overflow-hidden">
      {showDrawer && <Backdrop onHide={() => setShowDrawer(!showDrawer)} />}
      <SideDrawer show={showDrawer} onHide={() => setShowDrawer(false)} />
      <section className="w-full lg:basis-[calc(100%-270px)] bg-white lg:overflow-y-auto">
        <Outlet />
      </section>
    </main>
  );
}
