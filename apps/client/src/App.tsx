import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthLayout from './components/layouts/auth-layout/AuthLayout';
import Login from './pages/auth/login/Login';
import ForgotPassword from './pages/auth/forgot-password/ForgotPassword';
import ResetPassword from './pages/auth/reset-password/ResetPassword';
import DashboardLayout from './components/layouts/dashboard-layout/DashboardLayout';
import SystemOverview from './pages/dashboard/overview/SystemOverview';
import AcademicDivision from './pages/dashboard/academic-division/AcademicDivision';
import Archive from './pages/dashboard/archive/Archive';
import AccountSettings from './pages/dashboard/account-settings/AccountSetting';
import ManageUsers from './pages/dashboard/manage-users/ManageUsers';
import Checker from './pages/dashboard/plagiarism-checker/checker/Checker';
import Schedule from './pages/dashboard/plagiarism-checker/schedule/Schedule';
import History from './pages/dashboard/plagiarism-checker/history/History';
import CheckRememberMe from './pages/auth/login/CheckRememberMe';
import CheckResetToken from './pages/auth/reset-password/CheckResetToken';

export default function App() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          index: true,
          element: (
            <CheckRememberMe>
              <Login />
            </CheckRememberMe>
          ),
        },
        { path: 'forgot-password', element: <ForgotPassword /> },
        {
          path: 'reset-password',
          element: (
            <CheckResetToken>
              <ResetPassword />
            </CheckResetToken>
          ),
        },
      ],
    },
    {
      path: 'dashboard',
      element: <DashboardLayout />,
      children: [
        { index: true, element: <SystemOverview /> },
        { path: 'checker', element: <Checker /> },
        { path: 'checker/schedule', element: <Schedule /> },
        { path: 'checker/history', element: <History /> },
        { path: 'academic-division', element: <AcademicDivision /> },
        { path: 'archive', element: <Archive /> },
        { path: 'manage-users', element: <ManageUsers /> },
        { path: 'account-settings', element: <AccountSettings /> },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
}
