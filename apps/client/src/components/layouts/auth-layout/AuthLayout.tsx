import { Outlet } from 'react-router-dom';

import AppLogo from '../../molecules/app-logo/AppLogo';

export default function AuthLayout(): JSX.Element {
  return (
    <main className="w-full h-screen bg-[var(--gray-100)] overflow-hidden flex items-center justify-center">
      <section className="basis-[90%] p-5 md:p-8 rounded-2xl shadow-md md:basis-[471px] border border-[var(--gray-900)] bg-white space-y-4">
        <AppLogo />
        <Outlet />
      </section>
    </main>
  );
}
