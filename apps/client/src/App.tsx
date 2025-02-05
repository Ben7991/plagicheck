import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import AuthLayout from './components/layouts/auth-layout/AuthLayout';
import Login from './pages/auth/login/Login';
import ForgotPassword from './pages/auth/forgot-password/ForgotPassword';
import ResetPassword from './pages/auth/reset-password/ResetPassword';

export default function App() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        { index: true, element: <Login /> },
        { path: 'forgot-password', element: <ForgotPassword /> },
        { path: 'reset-password', element: <ResetPassword /> },
      ],
    },
  ]);

  return <RouterProvider router={appRouter} />;
}
