import { useCallback, useLayoutEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import SideDrawer from '../../organisms/side-drawer/SideDrawer';
import Backdrop from '../../atoms/back-drop/Backdrop';
import { MobileDrawerObserver } from '../../../util/observer/mobile-drawer.observer';

export default function DashboardLayout() {
  const [showDrawer, setShowDrawer] = useState(false);

  const toggleDrawer = useCallback(() => {
    setShowDrawer(!showDrawer);
  }, [showDrawer]);

  useLayoutEffect(() => {
    const drawerObserver = MobileDrawerObserver.getInstance();
    drawerObserver.setListener(toggleDrawer);
  }, [toggleDrawer]);

  return (
    <main className="w-full h-screen lg:flex">
      {showDrawer && <Backdrop onHide={() => setShowDrawer(!showDrawer)} />}
      <SideDrawer show={showDrawer} />
      <section className="w-full lg:basis-[calc(100%-270px)] bg-white">
        <Outlet />
      </section>
    </main>
  );
}
