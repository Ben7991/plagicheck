import { Outlet } from 'react-router-dom';

import SideDrawer from '../../organisms/side-drawer/SideDrawer';

export default function DashboardLayout() {
  return (
    <main className="w-full h-screen lg:flex">
      <SideDrawer />
      <section className="w-full lg:basis-[calc(100%-270px)] bg-white">
        <Outlet />
      </section>
    </main>
  );
}
